from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sqlite3
import json
import os
import requests
import base64
import io

app = Flask(__name__)
CORS(app)

# 🖼️ IMAGE UPLOAD CONFIG
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 🔥 CREATE TABLES (users + products + orders)
def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # USERS TABLE
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    """)

    # PRODUCTS TABLE
    c.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER,
            image TEXT,
            seller TEXT
        )
    """)

    # ORDERS TABLE
    c.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            items TEXT,
            total INTEGER,
            user TEXT,
            status TEXT
        )
    """)

    # Add new columns for category/quality if DB existed before them
    try:
        c.execute("ALTER TABLE products ADD COLUMN category TEXT")
    except Exception:
        pass

    try:
        c.execute("ALTER TABLE products ADD COLUMN quality TEXT")
    except Exception:
        pass

    try:
        c.execute("ALTER TABLE orders ADD COLUMN user TEXT")
    except Exception:
        pass

    conn.commit()
    conn.close()

init_db()

# 🏠 home
@app.route("/")
def home():
    return "Backend Running ✅"

# 🔐 REGISTER
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    try:
        c.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            (data["name"], data["email"], data["password"], data["role"])
        )
        conn.commit()
        return jsonify({"success": True})
    except:
        return jsonify({"success": False, "message": "User already exists"})
    finally:
        conn.close()

# 🔐 LOGIN
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "SELECT name, email, role FROM users WHERE email=? AND password=?",
        (data["email"], data["password"])
    )
    user = c.fetchone()
    conn.close()
    if user:
        return jsonify({
            "success": True,
            "user": {
                "name": user[0],
                "email": user[1],
                "role": user[2]
            }
        })
    else:
        return jsonify({"success": False})

# ➕ ADD PRODUCT
@app.route("/add-product", methods=["POST"])
def add_product():
    name = request.form.get("name")
    price = request.form.get("price")
    seller = request.form.get("seller")
    category = request.form.get("category")
    quality = request.form.get("quality")
    file = request.files.get("image")
    filename = None
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO products (name, price, image, seller, category, quality) VALUES (?, ?, ?, ?, ?, ?)",
        (name, price, filename, seller, category, quality)
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# 📦 GET PRODUCTS
@app.route("/products", methods=["GET"])
def get_products():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT id, name, price, image, seller, category, quality FROM products")
    rows = c.fetchall()
    conn.close()
    products = []
    for r in rows:
        products.append({
            "id": r[0],
            "name": r[1],
            "price": r[2],
            "image": r[3],
            "seller": r[4],
            "category": r[5],
            "quality": r[6]
        })
    return jsonify(products)

# ❌ DELETE PRODUCT
@app.route("/delete-product/<int:id>", methods=["DELETE"])
def delete_product(id):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("DELETE FROM products WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# 🔄 UPDATE PRODUCT
@app.route("/update-product/<int:id>", methods=["PUT"])
def update_product(id):
    data = request.get_json()
    name = data.get("name")
    price = data.get("price")
    category = data.get("category")
    quality = data.get("quality")
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("UPDATE products SET name=?, price=?, category=?, quality=? WHERE id=?", (name, price, category, quality, id))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# 🧾 CREATE ORDER
@app.route("/orders", methods=["POST"])
@app.route("/place-order", methods=["POST"])
def create_order():
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO orders (items, total, user, status) VALUES (?, ?, ?, ?)",
        (str(data["items"]), data["total"], data["user"], "Placed")
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# 📦 GET ORDERS
@app.route("/orders", methods=["GET"])
def get_orders():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT id, items, total, user, status FROM orders")
    rows = c.fetchall()
    conn.close()
    orders = []
    for r in rows:
        orders.append({
            "id": r[0],
            "items": r[1],
            "total": r[2],
            "user": r[3],
            "status": r[4]
        })
    return jsonify(orders)

# 🔄 UPDATE ORDER STATUS
@app.route("/update-order/<int:id>", methods=["POST"])
def update_order(id):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT status FROM orders WHERE id=?", (id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Order not found"}), 404
    current_status = row[0] or "Placed"
    next_status = "Shipped" if current_status == "Placed" else "Delivered"
    c.execute("UPDATE orders SET status=? WHERE id=?", (next_status, id))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "status": next_status})

@app.route("/update-status/<int:id>", methods=["PUT"])
def update_status(id):
    data = request.json
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "UPDATE orders SET status=? WHERE id=?",
        (data["status"], id)
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# 🌿 AI CROP & SOIL DOCTOR ROUTE (FIXED & SECURE)
@app.route('/api/analyze', methods=['POST'])
def analyze_farm_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    
    try:
        # ✅ FIX: Get API key from Render Environment instead of hardcoding
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return jsonify({"error": "API Key missing in Render settings"}), 500

        # Read image and encode to Base64
        image_bytes = file.read()
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        mime_type = file.mimetype if file.mimetype else "image/jpeg"

        # ✅ FIX: Use gemini-1.5-flash (Standard model name)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

        prompt = """You are an expert agricultural AI assistant. Look at this image. 
        If it is a crop/plant: Identify it, assess its health, and give care tips point-wise. 
        If it is soil: Identify the likely soil type, its characteristics, and suggest suitable crops point-wise.
        Format your answer clearly with bullet points."""

        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64_image
                        }
                    }
                ]
            }]
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()

        if response.status_code == 200:
            analysis_text = data['candidates'][0]['content']['parts'][0]['text']
            return jsonify({"success": True, "analysis": analysis_text})
        else:
            return jsonify({"error": data.get("error", {}).get("message", "AI API Error")}), 500

    except Exception as e:
        print(f"Server Backend Error: {e}")
        return jsonify({"error": "Failed to connect to Google AI"}), 500

# 🖼️ SERVE IMAGES
@app.route("/uploads/<filename>")
def get_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)