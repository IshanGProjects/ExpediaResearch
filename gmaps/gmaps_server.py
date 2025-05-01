from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

# Route to handle search requests from the client
@app.route('/search', methods=['POST'])
def search_places():

    # Extract parameters (Locations/Search_Term) from the request
    data = request.get_json()
    location = data.get('location')
    search_term = data.get('search_term')

    if not location or not search_term:
        return jsonify({'error': 'GMAPS - Missing required parameters: location and search_term'}), 400

    # Google Places Text Search API endpoint
    url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

    # Params required for our first 3rd party call    
    params = {
        'query': f'{search_term} in {location}',
        'key': GOOGLE_API_KEY
    }

    # Step 1: Fetch data from Google Places API
    response = requests.get(url, params=params)

    # Fetch the entire response without limiting the results
    if response.status_code == 200:
        response_data = response.json()
    else:
        return jsonify({'error': 'Failed to fetch data from Google Places API'}), 500

    results_text = response_data.get('results', [])

    # Step 2: Fetch additional details for each place

    # Google Places Details API endpoint
    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
    
    results_details = []
    for place in results_text:
        #print(place['place_id'])
        details_response = requests.get(details_url, params={
            'place_id': place['place_id'],
            'fields': 'website,current_opening_hours,editorial_summary',
            'key': GOOGLE_API_KEY,
        }).json()
        #print(details_response)
        results_details.append({
            'website': details_response.get('result', {}).get('website'),
            'current_opening_hours': details_response.get('result', {}).get('current_opening_hours', {}).get('weekday_text'),
            'editorial_summary': details_response.get('result', {}).get('editorial_summary', {}).get('overview')
        })

    # Step 3: Get the image data for each place

    # Google Places Photo API endpoint
    photo_url = "https://maps.googleapis.com/maps/api/place/photo"

    results_photos = []
    for place in results_text:
        photo_reference = place.get('photos')[0]['photo_reference'] if place.get('photos') else None
        if photo_reference:
            photo_response = requests.get(photo_url, params={
                'photoreference': photo_reference,
                'maxwidth': 400,
                'key': GOOGLE_API_KEY,
            })
            if photo_response.status_code == 200:
                # Check if the URL is valid by making a HEAD request
                head_response = requests.head(photo_response.url)
                if head_response.status_code == 200:
                    results_photos.append(photo_response.url)
                else:
                    results_photos.append(None)
            else:
                results_photos.append(None)
        else:
            results_photos.append(None)


    # Step 4: Extract relevant data from the results
    extracted_data = []
    if len(results_text) == 0:
        return jsonify({'error': 'No results found for the given search term.'}), 404
    extracted_data = [
        {
            'name': results_text[i].get('name'),
            'image': results_photos[i],
            'location': results_text[i].get('formatted_address'),
            'details': results_details[i].get('editorial_summary'),
            'date': results_details[i].get('current_opening_hours'),
            'link': results_details[i].get('website')
        } for i in range(len(results_text) if len(results_text) < 7 else 6)  # Limit to 5 results for the client
    ]

    return jsonify({'data': extracted_data})


if __name__ == '__main__':
    port = 8081  # Change default port here
    app.run(host="0.0.0.0", port=port, debug=True)
