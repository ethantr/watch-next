import random
import pandas as pd
from data_store import data_store

def round_to_nearest_power_of_2(n):
    return 2 ** (n - 1).bit_length()


def initialize_tournament(tv_shows):
    print("Initialising..")
    # Reset the matchups dataframe
    data_store.matchups_df = data_store.matchups_df .iloc[0:0]
    # Update the tv shows dataframe
    data_store.tvs_df = pd.DataFrame(tv_shows)
    num_shows = len(data_store.tvs_df)
    previous_power = round_to_nearest_power_of_2(num_shows)
    if previous_power < num_shows:
        data_store.tvs_df = data_store.tvs_df.head(previous_power)
    print("creathing matchups",data_store.tvs_df)
    create_matchups()

def create_matchups(round_number=1):
    show_ids = data_store.tvs_df['show_id'].tolist()
    print("makign matchup",show_ids)
    random.shuffle(show_ids)
    
    matchups = []
    for i in range(0, len(show_ids), 2):
        
        matchup_id = len(matchups)
        show2_id = show_ids[i + 1] if i + 1 < len(show_ids) else None
        matchups.append({
            'match_id': matchup_id,
            'round_number': round_number,
            'show1_id': show_ids[i],
            'show1_name': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == show_ids[i], 'name'].iloc[0],
            'show1_poster_path': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == show_ids[i], 'poster_path'].iloc[0],
            'show2_id': show2_id,
            'show2_name': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == show2_id, 'name'].iloc[0] if show2_id else None,
            'show2_poster_path': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == show2_id, 'poster_path'].iloc[0] if show2_id else None,
            'winner_id': None
        })
    new_matchups_df = pd.DataFrame(matchups)
    data_store.matchups_df = pd.concat([data_store.matchups_df, new_matchups_df], ignore_index=True)
    print(data_store.matchups_df)

def set_winner(matchup_id, winner_id):
    data_store.matchups_df.loc[data_store.matchups_df['match_id'] == matchup_id, 'winner_id'] = winner_id
    current_round = data_store.matchups_df.loc[data_store.matchups_df['match_id'] == matchup_id, 'round_number'].iloc[0]
    check_and_create_next_round(current_round)

def check_and_create_next_round(current_round):
    matchups = data_store.matchups_df[data_store.matchups_df['round_number'] == current_round]
    if matchups['winner_id'].notna().all():
        next_round_participants = matchups['winner_id'].tolist()
        print(next_round_participants)
        if len(next_round_participants) == 1:
            set_final_winner(next_round_participants[0])
            return
        create_next_round_matchups(next_round_participants, round_number=current_round + 1)

def set_final_winner(winner_id):
    max_round = data_store.matchups_df['round_number'].max() + 1
    matchups = [{
        'match_id': len(data_store.matchups_df) + 1,
        'round_number': max_round,
        'show1_id': winner_id,
        'show1_name': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == winner_id, 'name'].iloc[0],
        'show1_poster_path': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == winner_id, 'poster_path'].iloc[0],
        'show2_id': None,
        'show2_name': None,
        'show2_poster_path': None,
        'winner_id': None
    }]
    new_matchups_df = pd.DataFrame(matchups)
    data_store.matchups_df = pd.concat([data_store.matchups_df, new_matchups_df], ignore_index=True)

def create_next_round_matchups(participants, round_number):
    matchups = []
    print(len(participants))
    if len(participants) == 1:
        return
    for i in range(0, len(participants), 2):
        matchup_id = len(data_store.matchups_df) + len(matchups)
        print(matchup_id)
        show2_id = participants[i + 1] if i + 1 < len(participants) else None
        matchups.append({
            'match_id': matchup_id,
            'round_number': round_number,
            'show1_id': participants[i],
            'show1_name': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == participants[i], 'name'].iloc[0],
            'show1_poster_path': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == participants[i], 'poster_path'].iloc[0],
            'show2_id': show2_id,
            'show2_name': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == show2_id, 'name'].iloc[0] if show2_id else None,
            'show2_poster_path': data_store.tvs_df.loc[data_store.tvs_df['show_id'] == show2_id, 'poster_path'].iloc[0] if show2_id else None,
            'winner_id': None
        })
    new_matchups_df = pd.DataFrame(matchups)
    data_store.matchups_df = pd.concat([data_store.matchups_df, new_matchups_df], ignore_index=True)
