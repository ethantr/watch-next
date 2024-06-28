# data_store.py
import pandas as pd

class DataStore:
    _instance = None
    tvs_df = pd.DataFrame(columns=['name', 'show_id', 'poster_path'])
    matchups_df = pd.DataFrame(columns=['match_id', 'round_number', 'show1_id', 'show1_name', 'show1_poster_path', 'show2_id', 'show2_name', 'show2_poster_path', 'winner_id'])

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataStore, cls).__new__(cls)
        return cls._instance

data_store = DataStore()
