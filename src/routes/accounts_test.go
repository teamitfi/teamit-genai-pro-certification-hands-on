package routes

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestGetAccountsReturnsSeededAccounts(t *testing.T) {
	seedsPath := filepath.Join("..", "..", "seeds", "accounts.json")
	raw, err := os.ReadFile(seedsPath)
	if err != nil {
		t.Fatalf("read seeds: %v", err)
	}
	var seeds []map[string]any
	if err := json.Unmarshal(raw, &seeds); err != nil {
		t.Fatalf("parse seeds: %v", err)
	}

	mux := http.NewServeMux()
	RegisterAccounts(mux)

	req := httptest.NewRequest(http.MethodGet, "/accounts", nil)
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}

	var body []map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode body: %v", err)
	}

	if len(body) != len(seeds) {
		t.Fatalf("len(body) = %d, want %d", len(body), len(seeds))
	}

	for i, account := range body {
		for _, key := range []string{"id", "name", "industry", "contacts"} {
			if _, ok := account[key]; !ok {
				t.Errorf("account[%d] missing %q", i, key)
			}
		}
		if _, ok := account["contacts"].([]any); !ok {
			t.Errorf("account[%d].contacts is not a JSON array", i)
		}
	}

	seedIDs := make(map[string]struct{}, len(seeds))
	for _, s := range seeds {
		id, _ := s["id"].(string)
		seedIDs[id] = struct{}{}
	}
	respIDs := make(map[string]struct{}, len(body))
	for _, a := range body {
		id, _ := a["id"].(string)
		respIDs[id] = struct{}{}
	}
	if len(seedIDs) != len(respIDs) {
		t.Fatalf("id set sizes differ: seeds=%d response=%d", len(seedIDs), len(respIDs))
	}
	for id := range seedIDs {
		if _, ok := respIDs[id]; !ok {
			t.Errorf("response missing seed id %q", id)
		}
	}
}
