import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve TMDB API key from environment variables
tmdb_api_key = os.getenv('TMDB_API_KEY')

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
        return tv_shows
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")

def get_movies():
    genre_dict = fetch_genres()
    tv_shows = fetch_trending_tv_shows()

    for show in tv_shows:
        show['genre_names'] = [genre_dict.get(genre_id, 'Unknown') for genre_id in show['genre_ids']]

    print(tv_shows)


get_movies()