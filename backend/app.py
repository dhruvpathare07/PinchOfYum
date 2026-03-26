from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime

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
        password TEXT,
        role TEXT DEFAULT 'user',
        blocked INTEGER DEFAULT 0
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS favorites(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        recipe_id TEXT
    )
    """)

    # ✅ Create admin
    cursor.execute("""
    INSERT OR IGNORE INTO users (username, password, role)
    VALUES ('admin', 'admin123', 'admin')
    """)

    conn.commit()
    conn.close()

init_db()

# ---------- REGISTER ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data["username"]
    password = data["password"]

    if username.lower() == "admin":
        return jsonify({"message": "Admin username is reserved"}), 400

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

# ---------- LOGIN ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT username, role, blocked FROM users WHERE username=? AND password=?",
        (username,password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        if user[2] == 1:
            return jsonify({"message": "User is blocked"})

        return jsonify({
            "message": "Login successful",
            "role": user[1]
        })
    else:
        return jsonify({"message":"Invalid credentials"})
# users from database
@app.route("/users")
def get_users():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("SELECT username, blocked, role FROM users")
    users = cursor.fetchall()

    conn.close()

    # ❌ remove admin
    users = [u for u in users if u[2] != "admin"]

    total_users = len(users)
    blocked_users = len([u for u in users if u[1] == 1])

    return jsonify({
        "total": total_users,
        "blocked": blocked_users
    })
# ---------- FAVORITES ----------
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

    return jsonify([r[0] for r in data])

# ---------- REVIEWS ----------
REVIEW_FILE = "reviews.json"

def load_reviews():
    try:
        with open(REVIEW_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_reviews(data):
    with open(REVIEW_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.route("/add-review", methods=["POST"])
def add_review():
    data = request.json
    reviews = load_reviews()

    reviews = [
        r for r in reviews
        if not (r["recipe_id"] == data["recipe_id"] and r["username"] == data["username"])
    ]

    data["date"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    reviews.append(data)
    save_reviews(reviews)

    return jsonify({"message": "Review added"})

@app.route("/reviews/<recipe_id>")
def get_reviews(recipe_id):
    reviews = load_reviews()
    return jsonify([r for r in reviews if r["recipe_id"] == recipe_id])
@app.route("/reviews/all")
def all_reviews():
    reviews = load_reviews()
    return jsonify(reviews)
# ✅ DELETE REVIEW (ADMIN)
@app.route("/delete-review", methods=["POST"])
def delete_review():
    data = request.json
    recipe_id = data["recipe_id"]
    username = data["username"]

    reviews = load_reviews()
    reviews = [r for r in reviews if not (r["recipe_id"] == recipe_id and r["username"] == username)]
    save_reviews(reviews)

    return jsonify({"message": "Review deleted"})

# ---------- BLOCK USER ----------
@app.route("/block-user", methods=["POST"])
def block_user():
    data = request.json
    username = data["username"]

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE users SET blocked=1 WHERE username=?",
        (username,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "User blocked"})

# ---------- ADD RECIPE ----------
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RECIPE_FILE = os.path.join(BASE_DIR, "data", "recipes.json")

@app.route("/add-recipe", methods=["POST"])
def add_recipe():
    new_recipe = request.json

    with open(RECIPE_FILE, "r") as f:
        recipes = json.load(f)

    recipes.append(new_recipe)

    with open(RECIPE_FILE, "w") as f:
        json.dump(recipes, f, indent=2)

    return jsonify({"message": "Recipe added successfully"})

# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)