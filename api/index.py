import os
import random
from flask import Flask, jsonify, request
import requests
from dotenv import load_dotenv
import pandas as pd
from flask_restful import Api, Resource, reqparse
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
        return data
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")

# next

# Global DataFrames to manage the tournament data
tvs_df = pd.DataFrame(columns=['name',"show_id","poster_path"])
matchups_df = pd.DataFrame(columns=['match_id', 'round_number', 'show1_id', 'show1_name','show1_poster_path','show2_id', 'show2_name','show2_poster_path', 'winner_id'])

def previous_power_of_2(n):
    if n <= 0:
        return 0
    return 1 << (n - 1).bit_length() - 1


def remove_show():
    # Remove a show (e.g., with the lowest impact) until the number of shows is a power of 2
    global tvs_df 
    if len(tvs_df ) > 1:
        tvs_df  = tvs_df[:-1]

@app.route('/api/tv/trending/initialise', methods=['POST'])
def initialize_tournament():
    global tvs_df, matchups_df
    trending_tv_shows = fetch_trending_tv_shows()
    if not trending_tv_shows:
        return jsonify({"error": "Failed to fetch trending TV shows"}), 500
    
    tv_shows_names = [show['name'] for show in trending_tv_shows.get('results', []) if 'name' in show]
    tv_show_ids = [show['id'] for show in trending_tv_shows.get('results', []) if 'id' in show]
    tv_show_images = [show['poster_path'] for show in trending_tv_shows.get('results', []) if 'poster_path' in show]
    
    if not tv_shows_names:
        return jsonify({"error": "No TV shows found"}), 404

    # Initialize movies DataFrame
    tvs_df = pd.DataFrame({'name': tv_shows_names,"show_id":tv_show_ids,"poster_path":tv_show_images})
    
     # Reduce the number of shows to the previous power of 2
    num_shows = len(tvs_df)
    previous_power = previous_power_of_2(num_shows)
    
    if previous_power < num_shows:
        tvs_df = tvs_df.head(previous_power)
    app.logger.info({"total_shows":num_shows,"last_power":previous_power})
    


    # Create initial matchups
    create_matchups()
    app.logger.info(tvs_df)
    result = matchups_df.to_dict()
    return jsonify(result), 201

def create_matchups(round_number=1):
    global tvs_df, matchups_df
    # Get list of show IDs
    show_ids = tvs_df['show_id'].tolist()
    random.shuffle(show_ids)
    matchups_df = pd.DataFrame(columns=['match_id', 'round_number', 'show1_id', 'show1_name','show1_poster_path','show2_id', 'show2_name','show2_poster_path', 'winner_id'])
    # Generate matchups
    matchups = []
    for i in range(0, len(show_ids), 2):
        matchup_id = len(matchups)
        movie2_id = show_ids[i + 1] if i + 1 < len(show_ids) else None
        matchups.append({
            'match_id': matchup_id,
            'round_number': round_number,
            'show1_name': tvs_df.loc[tvs_df['show_id'] == show_ids[i], 'name'].iloc[0],
            'show1_id': tvs_df.loc[tvs_df['show_id'] == show_ids[i], 'show_id'].iloc[0],
            'show1_poster_path':tvs_df.loc[tvs_df['show_id'] == show_ids[i], 'poster_path'].iloc[0],
            'show2_name': tvs_df.loc[tvs_df['show_id'] == movie2_id, 'name'].iloc[0] if movie2_id else None,
            'show2_id': tvs_df.loc[tvs_df['show_id'] == movie2_id, 'show_id'].iloc[0] if movie2_id else None,
            'show2_poster_path': tvs_df.loc[tvs_df['show_id'] == movie2_id, 'poster_path'].iloc[0] if movie2_id else None,
            'winner_id': None
        })
    
    # Append matchups to matchups_df
    new_matchups_df = pd.DataFrame(matchups)
    matchups_df = pd.concat([matchups_df, new_matchups_df], ignore_index=False)
    app.logger.info(matchups_df)

@app.route('/api/tv/trending/matchups', methods=['GET'])
def get_matchups():
    global matchups_df, tvs_df
    
    round_number = request.args.get('round', default=1, type=int)
    
    # Assuming matchups_df and movies_df are globals or accessible
    matchups = matchups_df[matchups_df['round_number'] == round_number]
    
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
            "winner_id": matchup['winner_id'],
        })
    
    return jsonify(result), 200

@app.route('/api/tv/trending/winner', methods=['POST'])
def set_winner():
    global matchups_df
    
    # Parse JSON data from the request body
    data = request.json
    matchup_id = data.get('matchup_id')
    winner_id = data.get('winner_id')
    
    # Validate data (optional)
    if matchup_id is None or winner_id is None:
        return jsonify({"error": "matchup_id and winner_id must be provided"}), 400
    
    # Update the matchups_df with the winner_id for the specified matchup_id
    matchups_df.loc[matchups_df['match_id'] == matchup_id, 'winner_id'] = winner_id
    
    # Check and create the next round if all matchups in this round are completed
    matchup = matchups_df[matchups_df['match_id'] == matchup_id].iloc[0]
    check_and_create_next_round(matchup['round_number'])
    app.logger.info(matchups_df)
    
    return jsonify({"message": "Winner updated", }), 200

def check_and_create_next_round(current_round):
    global matchups_df
    matchups = matchups_df[matchups_df['round_number'] == current_round]
    if matchups['winner_id'].notna().all():
        next_round_participants = matchups['winner_id'].tolist()
        if len(next_round_participants) == 1:
            app.logger.info(f"Tournament winner: {next_round_participants[0]}")
            # Optionally, store the winner information somewhere or return it
            set_final_winner(next_round_participants[0])
            return
        create_next_round_matchups(next_round_participants, round_number=current_round + 1)

def set_final_winner(winner_id):
    global matchups_df
    max_round = matchups_df['round_number'].max()+1
    matchups = []
    matchups.append({
            'match_id': len(matchups_df)+1,
            'round_number': max_round,
            'show1_name': tvs_df.loc[tvs_df['show_id'] == winner_id, 'name'].iloc[0],
            'show1_id': tvs_df.loc[tvs_df['show_id'] == winner_id, 'show_id'].iloc[0],
            'show1_poster_path': tvs_df.loc[tvs_df['show_id'] == winner_id, 'poster_path'].iloc[0],
            'show2_name': None,
            'show2_id':  None,
            'show2_poster_path': None,
            'winner_id': None
        })
    
    new_matchups_df = pd.DataFrame(matchups)
    matchups_df = pd.concat([matchups_df, new_matchups_df], ignore_index=True)

def create_next_round_matchups(participants, round_number):
    global matchups_df, tvs_df
    matchups = []
    if len(participants) == 1:
        return
    for i in range(0, len(participants), 2):
        matchup_id = len(matchups_df)+len(matchups) + 1
        show2_id = participants[i + 1] if i + 1 < len(participants) else None
        matchups.append({
            'match_id': matchup_id,
            'round_number': round_number,
            'show1_name': tvs_df.loc[tvs_df['show_id'] == participants[i], 'name'].iloc[0],
            'show1_id': tvs_df.loc[tvs_df['show_id'] == participants[i], 'show_id'].iloc[0],
            'show1_poster_path': tvs_df.loc[tvs_df['show_id'] == participants[i], 'poster_path'].iloc[0],
            'show2_name': tvs_df.loc[tvs_df['show_id'] == show2_id, 'name'].iloc[0] if show2_id else None,
            'show2_id': tvs_df.loc[tvs_df['show_id'] == show2_id, 'show_id'].iloc[0] if show2_id else None,
            'show2_poster_path': tvs_df.loc[tvs_df['show_id'] == show2_id, 'poster_path'].iloc[0] if show2_id else None,
            'winner_id': None
        })
    
    new_matchups_df = pd.DataFrame(matchups)
    matchups_df = pd.concat([matchups_df, new_matchups_df], ignore_index=True)


if __name__ == "__main__":
    app.run(debug = True,port = 8080)