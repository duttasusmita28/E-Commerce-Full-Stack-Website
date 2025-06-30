from flask import Flask, request, jsonify, session
import mysql.connector
from flask import send_from_directory
import os
import hashlib
from flask_session import Session
from flask_cors import CORS  
from werkzeug.utils import secure_filename

# Initialize Flask app first
app = Flask(__name__) 

# Set up CORS
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads folder if not exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



# ✅ Configure Flask Sessions
app.secret_key = "545b991bdc6f1d3815533075e9dea8a4"
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True # 🔥 Fix: Keep the session active
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_COOKIE_SECURE"] = False  # Set to True in production
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
Session(app)

# ✅ Check if Flask is Running
@app.route('/')
def home():
    return "Flask server is running!"

# ✅ Database Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',  # Change this if different
    'password': 'Susmit@28',  # Change this if different
    'database': 'ecommerce_db'
}


# ✅ Password Hashing Function
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ✅ Sign-Up API
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if not name or not email or not phone or not password:
        return jsonify({"success": False, "message": "All fields are required!"}), 400

    password_hashed = hash_password(password)

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO users (name, email, phone, password) VALUES (%s, %s, %s, %s)", 
                       (name, email, phone, password_hashed))
        conn.commit()
        return jsonify({"success": True, "message": "User registered successfully!"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"success": False, "message": "Email already exists!"}), 400
    finally:
        cursor.close()
        conn.close()

# ✅ Sign-In API
@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = hash_password(data.get('password'))

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        session.modified = True  

        print("✅ Login Successful. Redirecting to index.html")  
        return jsonify({
            "success": True,
            "message": "Login successful!",
            "redirect": "http://127.0.0.1:5500/frontend/index.html"
        }), 200
    else:
        print("❌ Invalid credentials")  
        return jsonify({"success": False, "message": "Invalid credentials!"}), 401

# ✅ Check User Session API
@app.route('/check-session', methods=['GET'])
def check_session():
    try:
        print("🔍 Checking session in Flask...")
        print("Session Data:", dict(session))  # Debugging

        if 'user_id' in session:
            print("✅ User is logged in:", session['user_id'])
            return jsonify({"logged_in": True, "user": session.get('user_name', 'Guest')}), 200
        else:
            print("❌ No active session")
            return jsonify({"logged_in": False}), 200
    except Exception as e:
        print("⚠️ Error in check-session:", str(e))
        return jsonify({"logged_in": False, "error": str(e)}), 500

# ✅ Logout API
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  
    print("✅ User logged out")  
    return jsonify({"success": True, "message": "Logged out successfully!"}), 200

# users_list
# ✅ Get Users List for Admin Panel
@app.route('/get_users', methods=['GET'])
def get_users():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, phone FROM users")
        users = cursor.fetchall()
        return jsonify(users)
    except Exception as e:
        print("Error fetching users:", str(e))
        return jsonify({'success': False, 'error': 'Failed to fetch users'}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()


from flask import send_from_directory
import os

# Function to serve static frontend pages
def serve_page(filename):
    return send_from_directory(os.path.join(os.getcwd(), "frontend"), filename)

# ✅ Serve Homepage
@app.route('/home')
def serve_home():
    return serve_page("index.html")

# ✅ Serve Shop Page
@app.route('/shop')
def serve_shop():
    return serve_page("shop.html")

# ✅ Serve Blog Page
@app.route('/blog')
def serve_blog():
    return serve_page("blog.html")

# ✅ Serve Contact Page
@app.route('/contact')
def serve_contact():
    return serve_page("contact.html")

# ✅ Serve Wishlist Page
@app.route('/wishlist')
def serve_wishlist():
    return serve_page("wishlist.html")

# ✅ Serve Cart Page
@app.route('/cart')
def serve_cart():
    return serve_page("cart.html")

# ✅ Serve Profile Page
@app.route('/profile')
def serve_profile():
    return serve_page("profile.html")


#add product api
@app.route('/addproduct', methods=['POST'])
def add_product():
    try:
        # Log to verify request is hitting the backend
        print("Received product addition request")

        # Check if the 'image' field is in the form
        if 'image' not in request.files:
            print("No image file in the request")
            return jsonify({'success': False, 'error': 'Image is required'}), 400

        image = request.files['image']
        if image.filename == '':
            print("No image selected")
            return jsonify({'success': False, 'error': 'No image selected'}), 400

        # Secure the image filename and save it
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)

        # Retrieve form data
        name = request.form.get('name')
        category = request.form.get('category')
        price = request.form.get('price')
        seller_location = request.form.get('seller_location')
        description = request.form.get('description')
        seller_id = request.form.get('seller_id')

        # Ensure all required fields are filled
        if not all([name, category, price, seller_location, description, seller_id]):
            return jsonify({'success': False, 'error': 'All fields are required'}), 400

        # Insert the product into the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO products (name, category, price, image, seller_location, description, seller_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (name, category, price, f"/uploads/{filename}", seller_location, description, seller_id))

        conn.commit()

        print("Product added successfully")
        return jsonify({'success': True, 'message': 'Product added successfully'})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()



# Add URL rule to serve images from the uploads folder
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)   


@app.route('/getproducts', methods=['GET'])
def get_products():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, category, price, image, description, seller_id, seller_location FROM products")
        products = cursor.fetchall()
        return jsonify(products)
    except mysql.connector.Error as err:
        return jsonify({'error': 'Database error'}), 500
    finally:
        cursor.close()
        conn.close()


# ✅ Add Seller API
@app.route('/addseller', methods=['POST'])
def add_seller():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    location = data.get('location')

    if not all([name, email, phone, location]):
        return jsonify({'success': False, 'message': 'All fields are required!'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO seller (NAME, EMAIL, PHONE, LOCATION)
            VALUES (%s, %s, %s, %s)
        """, (name, email, phone, location))
        conn.commit()

        return jsonify({'success': True, 'message': 'Seller added successfully!'}), 201
    except mysql.connector.Error as e:
        return jsonify({'success': False, 'message': 'Database error', 'details': str(e)}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()


@app.route('/getsellers', methods=['GET'])
def get_sellers():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, location FROM seller")
        sellers = cursor.fetchall()
        return jsonify(sellers)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()



if __name__ == '__main__':
    print("🚀 Flask is starting...")  
    app.run(debug=True)