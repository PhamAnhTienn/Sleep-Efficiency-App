from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from pymongo import MongoClient
import os
import numpy as np
import pandas as pd
from src.Sleep_Efficiency_App.pipeline.prediciton import PredictionPipeline
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

MONGO_DB_URL = os.getenv('MONGO_DB_URL')
client = MongoClient(MONGO_DB_URL)
db = client.userAuth  
users_collection = db.users

POSTGRES_URL = os.getenv('POSTGRES_URL')
engine = create_engine(POSTGRES_URL)
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()

class Note(Base):
    __tablename__ = 'notes'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    prediction = Column(String(50), nullable=False)
    note = Column(Text, nullable=False)

Base.metadata.create_all(engine)

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

@app.route('/api/notes', methods=['POST'])
def create_note():
    try:
        data = request.json
        new_note = Note(
            name=data['name'],
            prediction=data['prediction'],
            note=data['note']
        )
        session.add(new_note)
        session.commit()
        return jsonify({'message': 'Note created successfully'}), 201
    except Exception as e:
        logger.error(f'Error creating note: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes', methods = ['GET'])
def get_notes():
    try:
        notes = session.query(Note).all()
        note_list = [{'name' : note.name , 'prediction': note.prediction, 'note': note.note} for note in notes]
        return jsonify(note_list), 200
    except Exception as e:
        logger.error( f'Error fetching notes: {e}' )
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<name>', methods = ['GET'])
def get_note_by_name(name):
    try:
        note = session.query(Note).filter_by(name=name).first()
        if note:
            return jsonify({'name': note.name, 'prediction': note.prediction, 'note': note.note}), 200
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        logger.error( f'Error fetching note by name: {e}' )
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<name>', methods=['PUT'])
def update_note_by_name(name):
    try:
        data = request.json
        note = session.query(Note).filter_by(name=name).first()

        if note:
            note.prediction = data.get('prediction', note.prediction)
            note.note = data.get('note', note.note)
            session.commit()
            return jsonify({'message': 'Note updated successfully'}), 200
        else:
            return jsonify({'error': 'Note not found'}), 404

    except Exception as e:
        logger.error(f'Error updating note: {e}')
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/notes/<name>', methods = ['DELETE'])
def delete_note_by_name(name):
    try:
        logger.info(f'Deleting note with name: {name}')
        result = session.query(Note).filter_by(name=name).delete()
        session.commit()
        if result == 0:
            return jsonify({'error': 'Note not found'}), 404
        return jsonify({'message': 'Note deleted successfully'}), 200
    except Exception as e:
        logger.error(f'Error deleting note: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
