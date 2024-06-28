# routes/tournament.py
from flask import Blueprint, jsonify, request
from services.tmdb_service import fetch_trending_tv_shows
from services.tournament_service import initialize_tournament, create_matchups, set_winner, check_and_create_next_round
from data_store import data_store
import pandas as pd

tournament_bp = Blueprint('tournament', __name__)

@tournament_bp.route('/tournament/initialise', methods=['POST'])
def initialize():
    trending_tv_shows = fetch_trending_tv_shows()
    if not trending_tv_shows:
        return jsonify({"error": "Failed to fetch trending TV shows"}), 500

    tv_shows = [
        {
            'name': show['name'],
            'show_id': show['id'],
            'poster_path': show['poster_path']
        } for show in trending_tv_shows.get('results', []) if 'name' in show
    ]

    if not tv_shows:
        return jsonify({"error": "No TV shows found"}), 404

    initialize_tournament(tv_shows)
    print(data_store.matchups_df)
    return jsonify(data_store.matchups_df.to_dict()), 201

@tournament_bp.route('/tournament/matchups', methods=['GET'])
def get_matchups():
    round_number = request.args.get('round', default=1, type=int)
    matchups = data_store.matchups_df[data_store.matchups_df['round_number'] == round_number]
    result = []

    for _, matchup in matchups.iterrows():
        result.append({
            'match_id': matchup["match_id"],
            'round_number': matchup['round_number'],
            'show1_id': matchup['show1_id'],
            'show2_id': matchup['show2_id'] if pd.notna(matchup['show2_id']) else None,
            'show1_name': matchup['show1_name'],
            'show2_name': matchup['show2_name'],
            'show1_poster_path': matchup['show1_poster_path'],
            'show2_poster_path': matchup['show2_poster_path'],
            'winner_id': matchup['winner_id']
        })

    return jsonify(result), 200

@tournament_bp.route('/tournament/winner', methods=['POST'])
def set_winner_endpoint():
    data = request.json
    matchup_id = data.get('matchup_id')
    winner_id = data.get('winner_id')

    if matchup_id is None or winner_id is None:
        return jsonify({"error": "matchup_id and winner_id must be provided"}), 400

    set_winner(matchup_id, winner_id)
    current_round = data_store.matchups_df.loc[data_store.matchups_df['match_id'] == matchup_id, 'round_number'].iloc[0]
    check_and_create_next_round(current_round)

    return jsonify({"message": "Winner updated"},200)