from flask import Flask, request, jsonify
import pandas as pd

# Global DataFrames to manage the tournament data
movies_df = pd.DataFrame(columns=['id', 'name'])
matchups_df = pd.DataFrame(columns=['id', 'round_number', 'movie1_id', 'movie2_id', 'winner_id'])

def initialize_tournament():
    global movies_df, matchups_df
    movies = request.json['movies']
    # Initialize movies DataFrame
    movies_df = pd.DataFrame({'id': range(1, len(movies) + 1), 'name': movies})
    # Create initial matchups
    create_matchups()
    return jsonify({"message": "Tournament initialized"}), 201

def create_matchups(round_number=1):
    global movies_df, matchups_df
    movies = movies_df['id'].tolist()
    matchups = []
    for i in range(0, len(movies), 2):
        matchup_id = len(matchups_df) + 1
        matchups.append([matchup_id, round_number, movies[i], movies[i + 1], None])
    new_matchups_df = pd.DataFrame(matchups, columns=['id', 'round_number', 'movie1_id', 'movie2_id', 'winner_id'])
    matchups_df = pd.concat([matchups_df, new_matchups_df], ignore_index=True)

def get_matchups():
    global matchups_df, movies_df
    round_number = request.args.get('round', 1, type=int)
    matchups = matchups_df[matchups_df['round_number'] == round_number]
    result = []
    for _, matchup in matchups.iterrows():
        movie1_name = movies_df[movies_df['id'] == matchup['movie1_id']]['name'].values[0]
        movie2_name = movies_df[movies_df['id'] == matchup['movie2_id']]['name'].values[0]
        result.append({
            'id': matchup['id'],
            'round_number': matchup['round_number'],
            'movie1_id': matchup['movie1_id'],
            'movie2_id': matchup['movie2_id'],
            'movie1': movie1_name,
            'movie2': movie2_name
        })
    return jsonify(result), 200

def set_winner():
    global matchups_df
    matchup_id = request.json['matchup_id']
    winner_id = request.json['winner_id']
    matchups_df.loc[matchups_df['id'] == matchup_id, 'winner_id'] = winner_id
    # Create next round if all matchups in this round are completed
    matchup = matchups_df[matchups_df['id'] == matchup_id].iloc[0]
    check_and_create_next_round(matchup['round_number'])
    return jsonify({"message": "Winner updated"}), 200

def check_and_create_next_round(current_round):
    global matchups_df
    matchups = matchups_df[matchups_df['round_number'] == current_round]
    if matchups['winner_id'].notna().all():
        next_round_participants = matchups['winner_id'].tolist()
        create_next_round_matchups(next_round_participants, round_number=current_round + 1)

def create_next_round_matchups(participants, round_number):
    global matchups_df
    matchups = []
    for i in range(0, len(participants), 2):
        matchup_id = len(matchups_df) + 1
        matchups.append([matchup_id, round_number, participants[i], participants[i + 1], None])
    new_matchups_df = pd.DataFrame(matchups, columns=['id', 'round_number', 'movie1_id', 'movie2_id', 'winner_id'])
    matchups_df = pd.concat([matchups_df, new_matchups_df], ignore_index=True)

