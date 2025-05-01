package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go-backend/auth"
	"go-backend/db"
	"go-backend/endpoints"
	"go-backend/factories"
	"log"
	"net/http"

	firebase "firebase.google.com/go/v4"
	"github.com/gorilla/mux"
	"google.golang.org/api/option"
)

func commonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// respondWithError ensures CORS headers are sent in error responses too
func respondWithError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func main() {
	router := mux.NewRouter()
	router.Use(commonMiddleware) // ✅ Apply before all routes

	// Firebase Setup
	opt := option.WithCredentialsFile("./escapia-login-firebase-adminsdk-fbsvc-aa851b3e38.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Failed to create Firebase app: %v", err)
	}

	authClient, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("Failed to create Firebase auth client: %v", err)
	}

	authService := &auth.AuthService{
		FireAuth: authClient,
	}
	authController := endpoints.NewAuthController(authService)

	sa := option.WithCredentialsFile("./escapia-login-firebase-adminsdk-fbsvc-aa851b3e38.json")
	app, err = firebase.NewApp(context.Background(), nil, sa)
	if err != nil {
		log.Fatalln(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalf("Failed to create Firestore: %v", err)
	}
	dbController := db.NewDBController(client)
	// Routes
	router.HandleFunc("/login", authController.LoginHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/register", authController.RegisterHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/resetpwd", authController.ResetHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/itineraries", dbController.GetItineraries).Methods("GET")
	router.HandleFunc("/deleteitinerary", dbController.DeleteItineraries).Methods("GET")
	router.HandleFunc("/putitinerary", dbController.PutItineraries).Methods("GET")
	router.HandleFunc("/deletesubitinerary", dbController.DeleteSubItineraries).Methods("POST")
	router.HandleFunc("/updatesubitinerary", dbController.UpdateSubItineraries).Methods("POST")
	// Health check route
	router.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Server check verified")
	}).Methods("GET", "OPTIONS")

	// Service route
	serviceDirector := factories.NewServiceDirector()
	router.HandleFunc("/promptOpenAI", func(w http.ResponseWriter, r *http.Request) {
		serviceDirector.ProcessPrompt(w, r)
	}).Methods("POST", "OPTIONS")

	// Run server
	port := "8000"
	log.Println("Server listening on port", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal("Error starting server:", err)
	}
}
