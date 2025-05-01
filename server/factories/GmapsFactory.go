package factories

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"bytes"
	"net/http"
	"os"
	"strings"
)

// MapsFactory struct
type MapsFactory struct{}

// CreateProduct creates a new MapsProduct
func (f *MapsFactory) CreateProduct() AbstractProduct {
	return &MapsProduct{
		MapsProductBaseUrl: "http://host.docker.internal:8081/search",
	}
}

// MapsProduct struct
type MapsProduct struct {
	MapsProductBaseUrl string
}

// Ensure MapsProduct implements AbstractProduct
var _ AbstractProduct = (*MapsProduct)(nil)

func (p *MapsProduct) PerformAction(data map[string]string) (map[string]interface{}, error) {
	prompt, ok := data["prompt"]
	if !ok || prompt == "" {
		return nil, fmt.Errorf("GMAPS - missing 'prompt' key")
	}

	// Ask LLM to extract just the query
	queryParams, err := AnalyzeMapsPromptWithLLM(prompt)
	if err != nil {
		return nil, err
	}

	location, locOk := queryParams["location"]
	searchTerm, termOk := queryParams["search_term"]
	if !locOk || location == "" || !termOk || searchTerm == "" {
		return nil, fmt.Errorf("GMAPS - LLM did not return valid 'location' or 'search_term'")
	}

	query := []string{location, searchTerm}

	return p.performHTTPRequest(query)
}

// performHTTPRequest performs the GET request with query and date range
func (p *MapsProduct) performHTTPRequest(query []string) (map[string]interface{}, error) {
	
	// Extract location and search term from the query
	location := query[0]
	searchTerm := query[1]

	// Create the request body as JSON
	requestBody := map[string]string{
		"location":    location,
		"search_term": searchTerm,
	}

	// Marshal the request body to JSON
	body, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request body: %v", err)
	}

	// Create a POST request with the JSON body
	req, err := http.NewRequest("POST", p.MapsProductBaseUrl, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("GMAPS - failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GMAPS - failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Decode the JSON response
	var results interface{}
	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(&results); err != nil {
		return nil, fmt.Errorf("GMAPS - error decoding JSON response: %v", err)
	}

	// Ensure the results are in the expected format
	switch v := results.(type) {
	case map[string]interface{}:
		// Check if the "activities" field exists and is a list
		if activities, ok := v["activities"].([]interface{}); ok {
			return map[string]interface{}{"results": activities}, nil
		}
		return v, nil
	case []interface{}:
		fmt.Printf("GMAPS - Response Body: %s\n", v)
		return map[string]interface{}{"results": v}, nil
	default:
		return nil, fmt.Errorf("GMAPS - unexpected JSON response format")
	}

}


func AnalyzeMapsPromptWithLLM(prompt string) (map[string]string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	endpoint := "https://api.openai.com/v1/chat/completions"

	// Extract the query from the prompt using LLM
	requestBody := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{"role": "system", "content": "You extract query strings for google maps API calls from user prompts."},
			{"role": "system", "content": "Return a JSON object with exactly two keys: 'location', 'search_term'. No actions."},
			{"role": "user", "content": "Remove any part of the query that is related to tickets or sporting events."},
			{"role": "user", "content": fmt.Sprintf("Given this prompt: '%s', what should the search_term and location values be? ", prompt)},
			{"role": "system", "content": "response_format={ \"type\": \"json_object\" }"},
		},
		"max_tokens": 100,
	}

	body, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("GMAPS - failed to marshal request body: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, strings.NewReader(string(body)))
	if err != nil {
		return nil, fmt.Errorf("GMAPS - failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GMAPS - failed to make request: %v", err)
	}
	defer resp.Body.Close()
	
	responseData, err := io.ReadAll(resp.Body)
	
	if err != nil {
		return nil, fmt.Errorf("failed to read response data: %v", err)
	}


	type Response struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	var response Response

	if err := json.Unmarshal(responseData, &response); err != nil {
		return nil, fmt.Errorf("GMAPS - failed to unmarshal LLM response: %v", err)
	}

	fmt.Sprintf("GMAPS - The content is: ", response.Choices[0].Message.Content)
	content := response.Choices[0].Message.Content
	
	if len(response.Choices) == 0 {
		return nil, errors.New("GMAPS - no LLM response")
	}

	var result map[string]string
	if err := json.Unmarshal([]byte(content), &result); err != nil {
		return nil, fmt.Errorf("GMAPS - failed to decode LLM JSON: %v\nContent: %s", err, content)
	}
	return result, nil
}
