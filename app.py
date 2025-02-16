import os
import numpy as np
import pandas as pd
from src.pineline.inference_pineline import InferencePineline
from src.logger import logging
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from database.config import ApplicationConfig
from database.models import db, User

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Hello, World!"

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })
    
@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })
    
@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

# Route to trigger training the model 
@app.route('/train', methods=['GET'])
def training():
    os.system("python main.py")
    return "Training Successful"

# Route to handle predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        logging.info(f'Received data: {data}')

        Age = float(data['Age'])
        Gender = 1 if data['Gender'] == 'Male' else 0
        Bedtime = float(data['Bedtime'])
        Bedtime_AMPM = data['Bedtime_AMPM']
        if Bedtime_AMPM == 'PM' and Bedtime < 12:
            Bedtime += 12
        elif Bedtime_AMPM == 'AM' and Bedtime == 12:
            Bedtime = 0
        Wakeup_time = float(data['Wakeup_time'])
        Wakeup_time_AMPM = data['Wakeup_time_AMPM']
        if Wakeup_time_AMPM == 'PM' and Wakeup_time < 12:
            Wakeup_time += 12
        elif Wakeup_time_AMPM == 'AM' and Wakeup_time == 12:
            Wakeup_time = 0
        Sleep_duration = float(data['Sleep_duration'])
        Awakenings = float(data['Awakenings'])
        Caffeine_consumption = 1 if data['Caffeine_consumption'] == 'Yes' else 0
        Alcohol_consumption = 1 if data['Alcohol_consumption'] == 'Yes' else 0
        Smoking_status = 1 if data['Smoking_status'] == 'Yes' else 0
        Exercise_frequency = 1 if float(data['Exercise_frequency']) > 1 else 0

        input_data = [
            Age, Gender, Bedtime, Wakeup_time, Sleep_duration, 
            Awakenings, Caffeine_consumption, Alcohol_consumption,
            Smoking_status, Exercise_frequency
        ]

        feature_names = [
            'Age',
            'Gender',
            'Bedtime',
            'Wakeup time',
            'Sleep duration',
            'Awakenings',
            'Caffeine consumption',
            'Alcohol consumption',
            'Smoking status',
            'Exercise frequency'
        ]

        df = pd.DataFrame([input_data], columns=feature_names)
        obj = InferencePineline()
        predict = obj.predict(df)[0]
        prediction = f"{predict:.2f}"

        return jsonify({'result': prediction})

    except Exception as e:
        logging.error(f'Error during prediction: {e}')
        return jsonify({'error': str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
