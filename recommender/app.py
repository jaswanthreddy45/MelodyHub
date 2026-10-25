from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

TRACKS = [
    {"id":1,"title":"Golden Hour","artist":"Demo Artist","genre":"Chill","mood":"calm"},
    {"id":2,"title":"Neon Dreams","artist":"Demo Artist","genre":"Electronic","mood":"energetic"},
    {"id":3,"title":"Quiet Morning","artist":"Demo Artist","genre":"Ambient","mood":"calm"},
    {"id":4,"title":"Run the Night","artist":"Demo Artist","genre":"Pop","mood":"energetic"},
    {"id":5,"title":"Blue Skies","artist":"Demo Artist","genre":"Acoustic","mood":"happy"},
    {"id":6,"title":"Deep Focus","artist":"Demo Artist","genre":"Instrumental","mood":"focus"},
]
@app.get("/health")
def health():
    return jsonify({"status":"ok","service":"MelodyHub Python Recommender"})
@app.get("/recommendations")
def recommendations():
    order = {"calm":0,"focus":1,"happy":2,"energetic":3}
    return jsonify({"reason":"Demo rule: calm and focus tracks are listed first.",
                    "tracks":sorted(TRACKS,key=lambda t:order.get(t["mood"],9))})
if __name__ == "__main__":
    app.run(host="127.0.0.1",port=5001,debug=True)
