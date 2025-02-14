import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from urllib.parse import urlparse
import mlflow
import joblib
from datetime import datetime
from pathlib import Path
from src.utils import save_json
from src.entity import ModelEvaluationConfig
import dagshub

class ModelEvaluation:
    def __init__(self, config: ModelEvaluationConfig):
        self.config = config
        
        dagshub.init(repo_owner='PhamAnhTienn', repo_name='Sleep-Efficiency-App', mlflow=True)
        
    def eval_metrics(self, actual, pred):
        rmse = np.sqrt(mean_squared_error(actual, pred))
        mae = mean_absolute_error(actual, pred)
        r2 = r2_score(actual, pred)
        return rmse, mae, r2
    
    def evaluation(self):
        test_data = pd.read_csv(self.config.test_data_path)
        model = joblib.load(self.config.model_path)

        X_test = test_data.drop([self.config.target_column], axis=1)
        y_test = test_data[self.config.target_column]

        mlflow.set_registry_uri(self.config.mlflow_uri)
        
        tracking_url_type_store = urlparse(mlflow.get_tracking_uri()).scheme
        experiment_name = f"xgb_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        mlflow.set_experiment(experiment_name)

        with mlflow.start_run() as run:
            predicted_qualities = model.predict(X_test)

            (rmse, mae, r2) = self.eval_metrics(y_test, predicted_qualities)

            # Saving metrics as local
            metrics = {"rmse": rmse, "mae": mae, "r2": r2}
            save_json(path=Path(self.config.metric_file_name), data=metrics)

            # Save metrics, params, and model to MLflow
            mlflow.log_params(self.config.all_params)
            mlflow.log_metrics(metrics)

            # Model registry does not work with file store
            if tracking_url_type_store != "file":

                # Register the model
                # There are other ways to use the Model Registry, which depends on the use case,
                # please refer to the doc for more information
                mlflow.xgboost.log_model(model, "model", registered_model_name="sleep_efficiency_model")
            else:
                mlflow.xgboost.log_model(model, "model")