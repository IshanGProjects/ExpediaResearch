package db

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

type Itinerary struct {
	Cover  Cover   `json:"cover"`
	Layers []Layer `json:"layers"`
}

type Cover struct {
	Image       string `json:"image"`
	Title       string `json:"title"`
	Location    string `json:"location"`
	Description string `json:"description"`
}

type Layer struct {
	ID       string                 `json:"id"`
	Type     string                 `json:"type"` // "text" or "image"
	Content  string                 `json:"content"`
	Position Position               `json:"position"`
	Style    Style                  `json:"style"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Style struct {
	FontSize   *int    `json:"fontSize,omitempty"`
	FontFamily *string `json:"fontFamily,omitempty"`
	Color      *string `json:"color,omitempty"`
	ZIndex     int     `json:"zIndex"`
	Width      *int    `json:"width,omitempty"`
}

// AuthController is the controller for handling authentication requests
type DBController struct {
	DBService *firestore.Client
}

// NnewDBController creates a new instance of the dbController struct
func NewDBController(dbService *firestore.Client) *DBController {
	return &DBController{dbService}
}

// Login handles the POST /login route and login a new user with the provided credentials
func (c *DBController) GetItineraries(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("entered route")
	var userData struct {
		UserID string `json:"userID"`
	}
	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}
	if userData.UserID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "userID req'd"})
		return
	}
	iter := c.DBService.Collection("users").Doc(userData.UserID).Collection("itineraries").Documents(context.Background())
	var itineraryArray []Itinerary
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Error retrieving documents: %v", err)
		}

		var itinerary Itinerary
		if err := doc.DataTo(&itinerary); err != nil {
			log.Printf("Failed to decode document: %v", err)
			continue
		}
		itineraryArray = append(itineraryArray, itinerary)
		// log.Printf("Itinerary: %+v", itinerary)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(itineraryArray)
}

func (c DBController) GetItineraryById(w http.ResponseWriter, r *http.Request) {
	var userData struct {
		UserID      string `json:"userID"`
		ItineraryID string `json:"itineraryID"`
	}
	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}
	log.Printf("itinerary ID: %s", userData.ItineraryID)
	log.Printf("user ID: %s", userData.UserID)
	iter := c.DBService.Collection("users").Doc(userData.UserID).Collection("itineraries").Doc(userData.ItineraryID)
	docSnap, err := iter.Get(context.Background())
	if err != nil {
		log.Printf("Error fetching itinerary from Firestore: %v", err)
		http.Error(w, "Itinerary not found or database error", http.StatusInternalServerError)
		return
	}
	var itinerary Itinerary
	if err := docSnap.DataTo(&itinerary); err != nil {
		log.Printf("Error decoding Firestore document: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(itinerary)
}

func (c *DBController) PutItineraries(w http.ResponseWriter, r *http.Request) {
	var userData struct {
		UserID        string    `json:"userID"`
		ItineraryID   string    `json:"itineraryID"`
		ItineraryBody Itinerary `json:"itinerary"`
	}
	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}
	if userData.UserID == "" || userData.ItineraryID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "userID or itineraryID req'd"})
		return
	}
	docRef := c.DBService.Collection("users").Doc(userData.UserID).Collection("itineraries").Doc(userData.ItineraryID)
	_, err := docRef.Set(context.Background(), userData.ItineraryBody)
	if err != nil {
		log.Printf("Failed adding itinerary: %v", err)
		return
	}
	log.Println("Itinerary added successfully")
}

func (c *DBController) DeleteItineraries(w http.ResponseWriter, r *http.Request) {
	fmt.Println("entered route")
	var userData struct {
		UserID      string `json:"userID"`
		ItineraryID string `json:"itineraryID"`
	}
	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}
	if userData.UserID == "" || userData.ItineraryID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "userID or itineraryID req'd"})
		return
	}
	_, err := c.DBService.Collection("users").Doc(userData.UserID).Collection("itineraries").Doc(userData.ItineraryID).Delete(context.Background())
	//doc, err := c.DBService.Collection("users").Doc(userData.UserID).Get(context.Background())
	if err != nil {
		fmt.Println("err")
		http.Error(w, "User not found: "+err.Error(), http.StatusNotFound)
		return
	}
	// Return the document data as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("Delete method returned")
}

func (c *DBController) DeleteSubItineraries(w http.ResponseWriter, r *http.Request) {
	fmt.Println("entered route")
	var userData struct {
		UserID      string `json:"userID"`
		ItineraryID string `json:"itineraryID"`
		LayerID     string `json:"layerID"`
	}
	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}
	if userData.UserID == "" || userData.ItineraryID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "userID or itineraryID req'd"})
		return
	}
	// only use this if you want to delete a sub itinerary, for main collection use deleteitinerary
	docRef := c.DBService.Collection("users").Doc(userData.UserID).Collection("itineraries").Doc(userData.ItineraryID)
	docSnap, err := docRef.Get(context.Background())
	if err != nil {
		log.Fatalf("Failed to get document: %v", err)
	}
	var itinerary Itinerary
	if err := docSnap.DataTo(&itinerary); err != nil {
		log.Fatalf("Failed to parse document: %v", err)
	}
	targetID := userData.LayerID
	filteredLayers := make([]Layer, 0)
	for _, layer := range itinerary.Layers {
		if layer.ID != targetID {
			filteredLayers = append(filteredLayers, layer)
		}
	}
	_, err = docRef.Update(context.Background(), []firestore.Update{
		{Path: "Layers", Value: filteredLayers},
	})
	if err != nil {
		log.Fatalf("Failed to update layers: %v", err)
	}
	// Return the document data as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("delete method returned")
}

func (c *DBController) UpdateSubItineraries(w http.ResponseWriter, r *http.Request) {
	fmt.Println("entered route")
	var userData struct {
		UserID      string `json:"userID"`
		ItineraryID string `json:"itineraryID"`
		LayerID     string `json:"layerID"`
		LayerData   Layer  `json:"layerData"`
	}
	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}
	if userData.UserID == "" || userData.ItineraryID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "userID or itineraryID req'd"})
		return
	}
	// only use this if you want to add or update a sub itinerary, for main collection use putitinerary
	docRef := c.DBService.Collection("users").Doc(userData.UserID).Collection("itineraries").Doc(userData.ItineraryID)

	docSnap, err := docRef.Get(context.Background())
	if err != nil {
		return
	}
	var itinerary Itinerary
	if err := docSnap.DataTo(&itinerary); err != nil {
		return
	}
	found := false
	for i, layer := range itinerary.Layers {
		if layer.ID == userData.LayerID {
			itinerary.Layers[i] = userData.LayerData // Update existing
			found = true
			break
		}
	}
	if !found {
		itinerary.Layers = append(itinerary.Layers, userData.LayerData) // Add new
	}

	_, err = docRef.Update(context.Background(), []firestore.Update{
		{Path: "Layers", Value: itinerary.Layers},
	})
	// Return the document data as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("update method returned")
}
