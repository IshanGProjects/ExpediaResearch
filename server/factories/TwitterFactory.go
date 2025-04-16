package factories

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"golang.org/x/net/html"
)

// TwitterFactory struct
type TwitterFactory struct{}

// CreateProduct creates a new TwitterProduct
func (f *TwitterFactory) CreateProduct() AbstractProduct {
	return &TwitterProduct{
		TwitterProductBaseUrl: "http://host.docker.internal:8080/search",
	}
}

// TwitterProduct struct
type TwitterProduct struct {
	TwitterProductBaseUrl string
}

// Ensure TwitterProduct implements AbstractProduct
var _ AbstractProduct = (*TwitterProduct)(nil)

func (p *TwitterProduct) PerformAction(data map[string]string) (map[string]interface{}, error) {
	prompt, ok := data["prompt"]
	if !ok || prompt == "" {
		return nil, fmt.Errorf("missing 'prompt' key")
	}

	// Ask LLM to extract just the query
	queryParams, err := AnalyzeTwitterPromptWithLLM(prompt)
	if err != nil {
		return nil, err
	}

	query, ok := queryParams["query"]
	if !ok || query == "" {
		return nil, fmt.Errorf("LLM did not return a valid 'query'")
	}

	return p.performHTTPRequest(query)
}

// performHTTPRequest performs the GET request with query and date range
func (p *TwitterProduct) performHTTPRequest(query string) (map[string]interface{}, error) {
	now := time.Now().UTC()
	since := now.AddDate(0, -1, 0).Format("2006-01-02")
	until := now.Format("2006-01-02")

	// Build the body
	queryParams := url.Values{}
	queryParams.Set("f", "tweets")
	queryParams.Set("since", since)
	queryParams.Set("until", until)
	queryParams.Set("q", query)

	fullURL := fmt.Sprintf("%s?%s", p.TwitterProductBaseUrl, queryParams.Encode())
	fmt.Println("The full Twitter search URL is:", fullURL)

	// Send GET request
	resp, err := http.Get(fullURL)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// Read and print response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	doc, err := html.Parse(bytes.NewReader(body))
	if err != nil {
		panic(err)
	}

	var targetDivs []string

	var traverse func(*html.Node)
	traverse = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "div" {
			for _, attr := range n.Attr {
				// extract out the raw tweets themselves from the divs titled "tweet-content media-body"
				if attr.Key == "class" && attr.Val == "tweet-content media-body" {
					// Extract inner text
					targetDivs = append(targetDivs, extractText(n))
				}
			}
		}
		// Recursively traverse children
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			traverse(c)
		}
	}
	traverse(doc)

	// Convert the targetDivs slice to a JSON array
	jsonData, err := json.Marshal(targetDivs)
	if err != nil {
		panic(err)
	}

	// Handle the response as a JSON array (since targetDivs is already an array)
	var result []interface{}
	if err := json.Unmarshal(jsonData, &result); err != nil {
		panic(err)
	}

	// Wrap each tweet in a map with keys like tweet1, tweet2, ...
	if len(targetDivs) > 0 {
		resultMap := make(map[string]interface{})

		for i, tweet := range targetDivs {
			key := fmt.Sprintf("tweet%d", i+1)
			resultMap[key] = tweet
		}

		// Pretty-print the map for debug
		prettyJSON, err := json.MarshalIndent(resultMap, "", "  ")
		if err != nil {
			panic(err)
		}
		fmt.Println(string(prettyJSON))

		return resultMap, nil
	} else {
		return nil, errors.New("no tweets found in HTML response")
	}
}

// Function for pulling necessary divs (tweets) out of the HTML returned by the GET request
func extractText(n *html.Node) string {
	var sb strings.Builder
	var extract func(*html.Node)
	extract = func(n *html.Node) {
		if n.Type == html.TextNode {
			sb.WriteString(n.Data)
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			extract(c)
		}
	}
	extract(n)
	return sb.String()
}

func AnalyzeTwitterPromptWithLLM(prompt string) (map[string]string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	endpoint := "https://api.openai.com/v1/chat/completions"

	requestBody := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{"role": "system", "content": "You extract query strings for social media searches from user prompts."},
			{"role": "system", "content": "Return a JSON object with only one key: 'query'. No actions."},
			{"role": "user", "content": "Remove any part of the query that is related to Tickets, Accommodations, or Restaurants."},
			{"role": "user", "content": fmt.Sprintf("Given this prompt: '%s', what should the Twitter search query be? Respond with: {\"query\": \"...\"}", prompt)},
		},
		"max_tokens": 100,
	}

	body, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request body: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, strings.NewReader(string(body)))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	responseData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response data: %v", err)
	}

	var response struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(responseData, &response); err != nil {
		return nil, fmt.Errorf("failed to unmarshal LLM response: %v", err)
	}
	if len(response.Choices) == 0 {
		return nil, errors.New("no LLM response")
	}

	// Strip markdown
	content := strings.TrimSpace(response.Choices[0].Message.Content)
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimSuffix(content, "```")
	content = strings.TrimSpace(content)

	var result map[string]string
	if err := json.Unmarshal([]byte(content), &result); err != nil {
		return nil, fmt.Errorf("failed to decode LLM JSON: %v\nContent: %s", err, content)
	}
	return result, nil
}
