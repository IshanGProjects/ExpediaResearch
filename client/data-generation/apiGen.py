import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def get_tripadvisor_data(search_query, category, address, language):
    base_url = "https://api.content.tripadvisor.com/api/v1/location/search"
    api_key = os.getenv('TRIPADVISOR_API_KEY')
    params = {
        'searchQuery': search_query,
        'category': category,
        'address': address,
        'language': language,
        'key': api_key
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        print(f"Data fetched successfully from TripAdvisor for category {category}.")
        return response.json()
    else:
        print(f"Failed to fetch data from TripAdvisor: HTTP {response.status_code}")
        return None

def get_ticketmaster_data():
    base_url = "https://app.ticketmaster.com/discovery/v2/attractions.json"
    api_key = os.getenv('TICKETMASTER_API_KEY')
    params = {
        'apikey': api_key
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        print("Data fetched successfully from Ticketmaster.")
        return response.json()
    else:
        print(f"Failed to fetch data from Ticketmaster: HTTP {response.status_code}")
        return None

def main():
    # Get data from TripAdvisor
    tripadvisor_data = get_tripadvisor_data("new york", "attractions", "new york", "en")
    
    # Get data from Ticketmaster
    ticketmaster_data = get_ticketmaster_data()
    
    # Prepare data for saving
    results = [
        {
            "service": "TripAdvisor",
            "data": tripadvisor_data
        },
        {
            "service": "Ticketmaster",
            "data": ticketmaster_data
        }
    ]
    
    # Save to JSON file
    with open('api_results.json', 'w') as f:
        json.dump(results, f, indent=4)
    
    print("Data fetched and stored successfully.")

if __name__ == "__main__":
    main()
