package main

import (
	"log"
	"net"
	"os"
	"strconv"
)

func main() {
	port := 3000
	if p := os.Getenv("PORT"); p != "" {
		if n, err := strconv.Atoi(p); err == nil {
			port = n
		}
	}
	host := os.Getenv("HOST")
	if host == "" {
		host = "0.0.0.0"
	}

	addr := net.JoinHostPort(host, strconv.Itoa(port))
	srv := buildServer()
	log.Printf("CRM API listening at http://%s", addr)
	if err := srv.ListenAndServe(addr); err != nil {
		log.Fatal(err)
	}
}
