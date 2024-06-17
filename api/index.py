import os
from flask import Flask, jsonify
import requests
from dotenv import load_dotenv
app = Flask(__name__)

tmdb_api_key = os.getenv('TMDB_API_KEY')

@app.route('/api/movies', methods=['GET'])
def get_movies():
    print(tmdb_api_key)
    url = 'https://api.themoviedb.org/3/movie/popular?api_key='+tmdb_api_key
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

# /api/home
@app.route("/api/home",methods=["GET"])
def return_home():
    return jsonify({
        'message':"hello world",
    }

    )

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": tmdb_api_key, 
                    "people":["greg 1","greg2"]
                    })

if __name__ == "__main__":
    app.run(debug = True,port = 8080)