from flask import Flask
from routes.trending import trending_bp
from routes.tournament import tournament_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(trending_bp, url_prefix='/api/tv')
app.register_blueprint(tournament_bp, url_prefix='/api/tv')

if __name__ == "__main__":
    app.run(debug=True, port=8080)

