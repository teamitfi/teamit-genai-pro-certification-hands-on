package routes

import (
	"encoding/json"
	"net/http"
)

func RegisterAccounts(mux *http.ServeMux) {
	mux.HandleFunc("GET /accounts", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode([]any{})
	})
}
