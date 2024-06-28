# routes/trending.py
from flask import Blueprint, jsonify
from services.tmdb_service import fetch_genres, fetch_trending_tv_shows

trending_bp = Blueprint('trending', __name__)

@trending_bp.route('/trending', methods=['GET'])
def get_trending_tv_shows():
    genre_dict = fetch_genres()
    tv_shows = fetch_trending_tv_shows()
    for show in tv_shows.get('results', []):
        show['genre_names'] = [genre_dict.get(genre_id, 'Unknown') for genre_id in show['genre_ids']]
    return jsonify(tv_shows)
