from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Replace with your actual Google API key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

@app.route('/search', methods=['GET'])
def search_places():
    data = request.get_json()
    location = data.get('location')
    search_term = data.get('search_term')

    if not location or not search_term:
        return jsonify({'error': 'Missing required parameters: location and search_term'}), 400

    # Google Places Text Search API endpoint
    url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
    
    params = {
        'query': f'{search_term} in {location}',
        'key': GOOGLE_API_KEY
    }

    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch data from Google Places API'}), 500

    results = response.json().get('results', [])
    extracted_data = [
        {
            'name': place.get('name'),
            'address': place.get('formatted_address'),
            'rating': place.get('rating'),
            'types': place.get('types'),
        }
        for place in results
    ]

    return jsonify({'results': extracted_data})

if __name__ == '__main__':
    app.run(debug=True)
