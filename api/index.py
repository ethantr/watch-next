from flask import Flask,jsonify
app = Flask(__name__)


# /api/home
@app.route("/api/home",methods=["GET"])
def return_home():
    return jsonify({
        'message':"hello world",
    }

    )

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(debug = True,port = 8080)