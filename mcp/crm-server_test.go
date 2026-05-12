package main

import (
	"bufio"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	mcp "github.com/metoro-io/mcp-golang"
	"github.com/metoro-io/mcp-golang/transport/stdio"
)

func TestMCPToolListExposesOnlyListAccountsWithEmptySchema(t *testing.T) {
	serverInput, clientWriter := io.Pipe()
	clientReader, serverOutput := io.Pipe()
	transport := stdio.NewStdioServerTransportWithIO(serverInput, serverOutput)
	server := mcp.NewServer(transport, mcp.WithName("teamit-crm-test"))

	if err := registerTools(server, &crmClient{}); err != nil {
		t.Fatalf("registerTools: %v", err)
	}
	if err := server.Serve(); err != nil {
		t.Fatalf("Serve: %v", err)
	}
	defer clientWriter.Close()
	defer clientReader.Close()
	defer serverOutput.Close()

	scanner := bufio.NewScanner(clientReader)
	writeJSONLine(t, clientWriter, map[string]any{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "initialize",
		"params": map[string]any{
			"protocolVersion": "2025-06-18",
			"capabilities":    map[string]any{},
			"clientInfo": map[string]any{
				"name":    "crm-mcp-test",
				"version": "1.0.0",
			},
		},
	})
	writeJSONLine(t, clientWriter, map[string]any{
		"jsonrpc": "2.0",
		"method":  "notifications/initialized",
	})
	writeJSONLine(t, clientWriter, map[string]any{
		"jsonrpc": "2.0",
		"id":      2,
		"method":  "tools/list",
		"params":  map[string]any{},
	})

	_ = readLine(t, scanner)
	line := readLine(t, scanner)

	var response struct {
		ID     int `json:"id"`
		Result struct {
			Tools []struct {
				Name        string `json:"name"`
				InputSchema struct {
					Type       string                     `json:"type"`
					Properties map[string]json.RawMessage `json:"properties"`
				} `json:"inputSchema"`
			} `json:"tools"`
		} `json:"result"`
	}
	if err := json.Unmarshal([]byte(line), &response); err != nil {
		t.Fatalf("decode tools/list response: %v\nline:\n%s", err, line)
	}
	if response.ID != 2 {
		t.Fatalf("response id = %d, want 2", response.ID)
	}
	if len(response.Result.Tools) != 1 {
		t.Fatalf("tool count = %d, want 1", len(response.Result.Tools))
	}
	tool := response.Result.Tools[0]
	if tool.Name != "list_accounts" {
		t.Fatalf("tool name = %q, want list_accounts", tool.Name)
	}
	if tool.InputSchema.Type != "object" {
		t.Fatalf("input schema type = %q, want object", tool.InputSchema.Type)
	}
	if len(tool.InputSchema.Properties) != 0 {
		t.Fatalf("input schema properties = %v, want empty object", tool.InputSchema.Properties)
	}
}

func TestCRMClientListAccountsFetchesSeededAccountsJSON(t *testing.T) {
	var gotPath, gotAccept string
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotPath = r.URL.Path
		gotAccept = r.Header.Get("Accept")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`[{"id":"11111111-1111-4111-8111-111111111111","name":"Aurora Logistics Oy","industry":"Logistics","renewalDate":"2026-08-15","contacts":null}]`))
	}))
	defer api.Close()

	client, err := newCRMClient(api.URL)
	if err != nil {
		t.Fatalf("newCRMClient: %v", err)
	}
	client.httpClient = api.Client()

	accounts, err := client.listAccounts(context.Background())
	if err != nil {
		t.Fatalf("listAccounts: %v", err)
	}
	if gotPath != "/accounts" {
		t.Fatalf("path = %q, want /accounts", gotPath)
	}
	if gotAccept != "application/json" {
		t.Fatalf("Accept = %q, want application/json", gotAccept)
	}
	if len(accounts) != 1 {
		t.Fatalf("len(accounts) = %d, want 1", len(accounts))
	}
	if accounts[0].Name != "Aurora Logistics Oy" {
		t.Fatalf("account name = %q, want Aurora Logistics Oy", accounts[0].Name)
	}
	if accounts[0].Contacts == nil {
		t.Fatalf("contacts = nil, want empty slice")
	}
}

func TestCRMClientListAccountsRejectsNonJSON(t *testing.T) {
	api := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`<html></html>`))
	}))
	defer api.Close()

	client, err := newCRMClient(api.URL)
	if err != nil {
		t.Fatalf("newCRMClient: %v", err)
	}
	client.httpClient = api.Client()

	_, err = client.listAccounts(context.Background())
	if err == nil {
		t.Fatalf("listAccounts returned nil error, want Content-Type error")
	}
	if !strings.Contains(err.Error(), "Content-Type") {
		t.Fatalf("error = %q, want Content-Type detail", err.Error())
	}
}

func TestCRMClientRejectsInvalidBaseURL(t *testing.T) {
	if _, err := newCRMClient("localhost:3000"); err == nil {
		t.Fatalf("newCRMClient returned nil error, want invalid URL error")
	}
}

func writeJSONLine(t *testing.T, w io.Writer, value any) {
	t.Helper()
	payload, err := json.Marshal(value)
	if err != nil {
		t.Fatalf("marshal JSON-RPC message: %v", err)
	}
	payload = append(payload, '\n')
	if _, err := w.Write(payload); err != nil {
		t.Fatalf("write JSON-RPC message: %v", err)
	}
}

func readLine(t *testing.T, scanner *bufio.Scanner) string {
	t.Helper()
	lines := make(chan string, 1)
	errs := make(chan error, 1)
	go func() {
		if scanner.Scan() {
			lines <- scanner.Text()
			return
		}
		if err := scanner.Err(); err != nil {
			errs <- err
			return
		}
		errs <- io.EOF
	}()

	select {
	case line := <-lines:
		return line
	case err := <-errs:
		t.Fatalf("read JSON-RPC response: %v", err)
	case <-time.After(2 * time.Second):
		t.Fatalf("timed out waiting for JSON-RPC response")
	}
	return ""
}
