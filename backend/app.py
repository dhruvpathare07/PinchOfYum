from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# ---------- DATABASE SETUP ----------

def init_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS favorites(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        recipe_id TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------- REGISTER API ----------

@app.route("/register", methods=["POST"])
def register():

    data = request.json
    username = data["username"]
    password = data["password"]

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (username,password) VALUES (?,?)",
            (username,password)
        )

        conn.commit()
        conn.close()

        return jsonify({"message":"User registered successfully"})

    except:

        return jsonify({"message":"Username already exists"})


# ---------- LOGIN API ----------

@app.route("/login", methods=["POST"])
def login():

    data = request.json
    username = data["username"]
    password = data["password"]

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (username,password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"message":"Login successful"})
    else:
        return jsonify({"message":"Invalid credentials"})


# ---------- SAVE FAVORITE ----------

@app.route("/favorite", methods=["POST"])
def favorite():

    data = request.json
    username = data["username"]
    recipe_id = data["recipe_id"]

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO favorites (username,recipe_id) VALUES (?,?)",
        (username,recipe_id)
    )

    conn.commit()
    conn.close()

    return jsonify({"message":"Favorite saved"})


# ---------- GET FAVORITES ----------

@app.route("/favorites/<username>")
def get_favorites(username):

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT recipe_id FROM favorites WHERE username=?",
        (username,)
    )

    data = cursor.fetchall()
    conn.close()

    favorites = [r[0] for r in data]

    return jsonify(favorites)


# ---------- RUN SERVER ----------

if __name__ == "__main__":
    app.run(debug=True)