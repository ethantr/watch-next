import os
from flask import Flask, jsonify
import requests
from dotenv import load_dotenv
app = Flask(__name__)

tmdb_api_key = os.getenv('TMDB_API_KEY')

@app.route('/api/tv/trending', methods=['GET'])
def get_trending_tv_shows():
    genre_dict = fetch_genres()
    tv_shows = fetch_trending_tv_shows()

    for show in tv_shows.get('results', []):
        show['genre_names'] = [genre_dict.get(genre_id, 'Unknown') for genre_id in show['genre_ids']]

    return jsonify(tv_shows)

def fetch_genres():
    genre_url = f"https://api.themoviedb.org/3/genre/tv/list?api_key={tmdb_api_key}&language=en-US"
    genre_response = requests.get(genre_url)
    genres = genre_response.json().get('genres', [])
    genre_dict = {genre['id']: genre['name'] for genre in genres}
    print(genre_dict)
    return genre_dict

def fetch_trending_tv_shows():
    url = f"https://api.themoviedb.org/3/trending/tv/day?api_key={tmdb_api_key}&language=en-US"
    headers = {
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        tv_shows = data.get('results', [])  # Extract 'results' from JSON data
        return data
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")



if __name__ == "__main__":
    app.run(debug = True,port = 8080)