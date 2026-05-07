package routes

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
)

// Contact mirrors DOMAIN_MODEL.md.
type Contact struct {
	ID        string `json:"id"`
	AccountID string `json:"accountId"`
	Name      string `json:"name"`
	Role      string `json:"role"`
	Email     string `json:"email"`
}

// Account mirrors DOMAIN_MODEL.md. RenewalDate is nullable; modelled as *string
// so a missing JSON value (or explicit null) round-trips as nil and templates
// can omit the row instead of rendering "null".
type Account struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Industry    string    `json:"industry"`
	RenewalDate *string   `json:"renewalDate"`
	Contacts    []Contact `json:"contacts"`
}

// LoadAccounts reads and decodes a seed JSON file. It guarantees that every
// returned Account has a non-nil Contacts slice (empty collections must
// serialise as [], never null — DOMAIN_MODEL.md "Empty-state contracts").
func LoadAccounts(path string) ([]Account, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read seed %q: %w", path, err)
	}
	return decodeAccounts(raw)
}

// LoadAccountsFS is the fs.FS variant for tests / embedded seed loading.
func LoadAccountsFS(fsys fs.FS, path string) ([]Account, error) {
	raw, err := fs.ReadFile(fsys, path)
	if err != nil {
		return nil, fmt.Errorf("read seed %q: %w", path, err)
	}
	return decodeAccounts(raw)
}

func decodeAccounts(raw []byte) ([]Account, error) {
	var accounts []Account
	if err := json.Unmarshal(raw, &accounts); err != nil {
		return nil, fmt.Errorf("parse accounts seed: %w", err)
	}
	for i := range accounts {
		if accounts[i].Contacts == nil {
			accounts[i].Contacts = []Contact{}
		}
	}
	if accounts == nil {
		accounts = []Account{}
	}
	return accounts, nil
}

// AccountsHandler is the slice-1 HTML handler set. It owns its templates and
// the in-memory account list so the same instance can be wired against
// different fixture files in tests.
type AccountsHandler struct {
	accounts  []Account
	listTpl   *template.Template
	detailTpl *template.Template
}

// NewAccountsHandler builds a handler from a seed file path and a templates
// directory. The templates directory must contain layout.html plus
// accounts/list.html and accounts/detail.html.
func NewAccountsHandler(seedPath, templatesDir string) (*AccountsHandler, error) {
	accounts, err := LoadAccounts(seedPath)
	if err != nil {
		return nil, err
	}
	listTpl, detailTpl, err := parseTemplates(templatesDir)
	if err != nil {
		return nil, err
	}
	return &AccountsHandler{accounts: accounts, listTpl: listTpl, detailTpl: detailTpl}, nil
}

// parseTemplates produces one template set per page so each page's "content"
// block coexists with the shared layout. Both sets share the same layout.html
// and helper funcs.
func parseTemplates(dir string) (*template.Template, *template.Template, error) {
	layout := filepath.Join(dir, "layout.html")
	listFile := filepath.Join(dir, "accounts", "list.html")
	detailFile := filepath.Join(dir, "accounts", "detail.html")
	funcs := template.FuncMap{
		"deref": func(s *string) string {
			if s == nil {
				return ""
			}
			return *s
		},
	}
	list, err := template.New("list").Funcs(funcs).ParseFiles(layout, listFile)
	if err != nil {
		return nil, nil, fmt.Errorf("parse list templates in %q: %w", dir, err)
	}
	detail, err := template.New("detail").Funcs(funcs).ParseFiles(layout, detailFile)
	if err != nil {
		return nil, nil, fmt.Errorf("parse detail templates in %q: %w", dir, err)
	}
	return list, detail, nil
}

// Register wires the HTML routes onto mux.
func (h *AccountsHandler) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /accounts", h.handleList)
	mux.HandleFunc("GET /accounts/{id}", h.handleDetail)
}

func (h *AccountsHandler) handleList(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Title    string
		Accounts []Account
	}{
		Title:    "Accounts",
		Accounts: h.accounts,
	}
	h.render(w, h.listTpl, data)
}

func (h *AccountsHandler) handleDetail(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	idx := -1
	for i := range h.accounts {
		if h.accounts[i].ID == id {
			idx = i
			break
		}
	}
	if idx == -1 {
		http.NotFound(w, r)
		return
	}
	data := struct {
		Title   string
		Account Account
	}{
		Title:   h.accounts[idx].Name,
		Account: h.accounts[idx],
	}
	h.render(w, h.detailTpl, data)
}

func (h *AccountsHandler) render(w http.ResponseWriter, tpl *template.Template, data any) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// Each page is parsed into its own template set with the shared layout, so
	// executing "layout" runs the layout which references the page's
	// {{define "content"}} block.
	if err := tpl.ExecuteTemplate(w, "layout", data); err != nil {
		http.Error(w, "template error", http.StatusInternalServerError)
	}
}

// RegisterAccounts is kept as the historical entry point used by buildServer.
// It loads from the default seed location and template directory relative to
// the working directory. For tests, build an AccountsHandler explicitly.
func RegisterAccounts(mux *http.ServeMux) {
	seedPath := defaultSeedPath()
	tplDir := defaultTemplatesDir()
	h, err := NewAccountsHandler(seedPath, tplDir)
	if err != nil {
		// We intentionally surface boot-time wiring errors as 500s rather than
		// panicking the process — the /health route stays useful.
		mux.HandleFunc("GET /accounts", func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, fmt.Sprintf("accounts unavailable: %v", err), http.StatusInternalServerError)
		})
		mux.HandleFunc("GET /accounts/{id}", func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, fmt.Sprintf("accounts unavailable: %v", err), http.StatusInternalServerError)
		})
		return
	}
	h.Register(mux)
}

// defaultSeedPath finds seeds/accounts.json by walking up from cwd. This makes
// `go run ./src` work both from the repo root and from inside src/.
func defaultSeedPath() string {
	return findRepoFile(filepath.Join("seeds", "accounts.json"))
}

func defaultTemplatesDir() string {
	return findRepoFile(filepath.Join("src", "templates"))
}

func findRepoFile(rel string) string {
	cwd, err := os.Getwd()
	if err != nil {
		return rel
	}
	dir := cwd
	for i := 0; i < 6; i++ {
		candidate := filepath.Join(dir, rel)
		if _, err := os.Stat(candidate); err == nil {
			return candidate
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return rel
}
