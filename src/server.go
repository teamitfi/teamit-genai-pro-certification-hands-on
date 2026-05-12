package main

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"crmapi/src/routes"
)

type Server struct {
	mux *http.ServeMux
}

func buildServer() *Server {
	s := &Server{mux: http.NewServeMux()}

	routes.RegisterAccounts(s.mux)

	staticDir := findRepoPath(filepath.Join("src", "static"))
	s.mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir))))

	s.mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	// Friendly redirect: visiting / lands on the accounts list. The slice
	// owns the only UI route at the moment, so this is the only sensible
	// landing page.
	s.mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/accounts", http.StatusSeeOther)
	})

	return s
}

func (s *Server) ListenAndServe(addr string) error {
	return http.ListenAndServe(addr, s.mux)
}

// findRepoPath walks up from the working directory to locate a repo-relative
// path. Mirrors the helper in routes/accounts.go so `go run ./src` works
// regardless of where the binary was launched from.
func findRepoPath(rel string) string {
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
