package main

import (
	"encoding/json"
	"net/http"

	"crmapi/src/routes"
)

type Server struct {
	mux *http.ServeMux
}

func buildServer() *Server {
	s := &Server{mux: http.NewServeMux()}

	routes.RegisterAccounts(s.mux)

	s.mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	return s
}

func (s *Server) ListenAndServe(addr string) error {
	return http.ListenAndServe(addr, s.mux)
}
