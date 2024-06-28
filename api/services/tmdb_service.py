# services/tmdb_service.py
import requests
from config import Config

def fetch_genres():
    genre_url = f"https://api.themoviedb.org/3/genre/tv/list?api_key={Config.TMDB_API_KEY}&language=en-US"
    response = requests.get(genre_url)
    genres = response.json().get('genres', [])
    return {genre['id']: genre['name'] for genre in genres}

def fetch_trending_tv_shows():
    url = f"https://api.themoviedb.org/3/trending/tv/day?api_key={Config.TMDB_API_KEY}&language=en-US"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return None
