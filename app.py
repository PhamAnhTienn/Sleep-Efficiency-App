from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
import numpy as np
import pandas as pd
from src.Sleep_Efficiency_App.pipeline.prediciton import PredictionPipeline
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client.userAuth  
users_collection = db.users

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.json
        user = {
            'name': data['name'],
            'email': data['email'],
            'googleId': data['googleId'],
            'accessToken': data['accessToken']
        }
        users_collection.insert_one(user)
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        logger.error(f'Error creating user: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/logout', methods=['POST'])
def delete_user():
    try:
        data = request.json
        email = data['email']
        result = users_collection.delete_one({'email': email})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'User logged out and data deleted successfully'}), 200
    except Exception as e:
        logger.error(f'Error logging out user: {e}')
        return jsonify({'error': str(e)}), 500

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
        logger.info(f'Received data: {data}')

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
        obj = PredictionPipeline()
        predict = obj.predict(df)[0]
        prediction = f"{predict:.2f}"

        return jsonify({'result': prediction})

    except Exception as e:
        logger.error(f'Error during prediction: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
