package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	mcp "github.com/metoro-io/mcp-golang"
	"github.com/metoro-io/mcp-golang/transport/stdio"
)

const (
	defaultAPIBaseURL = "http://localhost:3000"
	accountsPath      = "accounts"
)

type listAccountsArguments struct{}

type contact struct {
	ID        string `json:"id"`
	AccountID string `json:"accountId"`
	Name      string `json:"name"`
	Role      string `json:"role"`
	Email     string `json:"email"`
}

type account struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Industry    string    `json:"industry"`
	RenewalDate *string   `json:"renewalDate"`
	Contacts    []contact `json:"contacts"`
}

type crmClient struct {
	baseURL    string
	httpClient *http.Client
}

type eofSignalingReader struct {
	reader io.Reader
	done   chan<- struct{}
	once   sync.Once
}

func main() {
	done := make(chan struct{})
	transport := stdio.NewStdioServerTransportWithIO(&eofSignalingReader{
		reader: os.Stdin,
		done:   done,
	}, os.Stdout)

	client, err := newCRMClient(apiBaseURLFromEnv())
	if err != nil {
		fmt.Fprintf(os.Stderr, "crm mcp: %v\n", err)
		os.Exit(1)
	}

	server := mcp.NewServer(
		transport,
		mcp.WithName("teamit-crm"),
		mcp.WithVersion("0.1.0"),
		mcp.WithInstructions("Read-only MCP server for the Teamit CRM API. Use list_accounts to inspect seeded CRM accounts."),
	)

	if err := registerTools(server, client); err != nil {
		fmt.Fprintf(os.Stderr, "crm mcp: %v\n", err)
		os.Exit(1)
	}

	if err := server.Serve(); err != nil {
		fmt.Fprintf(os.Stderr, "crm mcp: %v\n", err)
		os.Exit(1)
	}
	<-done
}

func (r *eofSignalingReader) Read(p []byte) (int, error) {
	n, err := r.reader.Read(p)
	if err == io.EOF {
		r.once.Do(func() {
			close(r.done)
		})
	}
	return n, err
}

func registerTools(server *mcp.Server, client *crmClient) error {
	return server.RegisterTool(
		"list_accounts",
		"List seeded CRM accounts from GET /accounts. Takes no input arguments and returns JSON.",
		func(ctx context.Context, _ listAccountsArguments) (*mcp.ToolResponse, error) {
			accounts, err := client.listAccounts(ctx)
			if err != nil {
				return nil, err
			}
			payload, err := json.Marshal(accounts)
			if err != nil {
				return nil, fmt.Errorf("marshal accounts: %w", err)
			}
			return mcp.NewToolResponse(mcp.NewTextContent(string(payload))), nil
		},
	)
}

func apiBaseURLFromEnv() string {
	if value := strings.TrimSpace(os.Getenv("CRM_API_BASE_URL")); value != "" {
		return value
	}
	return defaultAPIBaseURL
}

func newCRMClient(baseURL string) (*crmClient, error) {
	parsed, err := url.Parse(strings.TrimSpace(baseURL))
	if err != nil {
		return nil, fmt.Errorf("parse CRM_API_BASE_URL: %w", err)
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return nil, fmt.Errorf("CRM_API_BASE_URL must use http or https")
	}
	if parsed.Host == "" {
		return nil, fmt.Errorf("CRM_API_BASE_URL must include a host")
	}

	return &crmClient{
		baseURL: strings.TrimRight(parsed.String(), "/"),
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}, nil
}

func (c *crmClient) listAccounts(ctx context.Context) ([]account, error) {
	endpoint, err := url.JoinPath(c.baseURL, accountsPath)
	if err != nil {
		return nil, fmt.Errorf("build accounts URL: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("build accounts request: %w", err)
	}
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request accounts: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return nil, fmt.Errorf("accounts API returned %s: %s", resp.Status, strings.TrimSpace(string(body)))
	}

	contentType := resp.Header.Get("Content-Type")
	mediaType, _, err := mime.ParseMediaType(contentType)
	if err != nil || mediaType != "application/json" {
		return nil, fmt.Errorf("accounts API returned Content-Type %q, want application/json", contentType)
	}

	var accounts []account
	if err := json.NewDecoder(resp.Body).Decode(&accounts); err != nil {
		return nil, fmt.Errorf("decode accounts: %w", err)
	}
	if accounts == nil {
		accounts = []account{}
	}
	for i := range accounts {
		if accounts[i].Contacts == nil {
			accounts[i].Contacts = []contact{}
		}
	}
	return accounts, nil
}
