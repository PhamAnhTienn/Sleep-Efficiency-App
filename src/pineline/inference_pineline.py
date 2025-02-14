import joblib
import os
import numpy as np
import pandas as pd
from pathlib import Path
import dagshub
import mlflow
from mlflow.tracking import MlflowClient
from src.logger import logging

model_name = "sleep_efficiency_model"

class InferencePineline:
    def __init__(self):
        dagshub.init(repo_owner='PhamAnhTienn', repo_name='Sleep-Efficiency-App', mlflow=True)
        self.model = joblib.load(Path('artifacts/model_trainer/model.joblib'))
        
    def load_latest_model(self):
        mlflow.set_registry_uri("https://dagshub.com/PhamAnhTienn/Sleep-Efficiency-App.mlflow")
        client = MlflowClient()
        
        logging.info(f"Attempting to load latest version of model: {model_name}")
        latest_version = max(
            client.search_model_versions(f"name='{model_name}'"),
            key=lambda mv: int(mv.version)
        )
        latest_version_number = latest_version.version
        run_id = latest_version.run_id
        logging.info(
            f"Found model version: {latest_version_number} with run_id: {run_id}"
        )
        
        if not run_id:
            logging.error("No run_id found for the model version")
            return None, None

        # Load the model
        model = mlflow.pyfunc.load_model(f"models:/{model_name}/{latest_version_number}")
        logging.info("Model loaded successfully")
        
        self.model = model
        joblib.dump(model, os.path.join("artifacts/model_trainer", "model.joblib"))
        logging.info("Model saved to artifacts/model_trainer")
        
    def predict(self, data):
        prediction = self.model.predict(data)
        
        return prediction