from src.configuration import ConfigurationManager
from src.components.model_trainer import ModelTrainer
from src.components.data_validation import DataValidation
from src.logger import logging
import sys
from src.exception import CustomException

class TrainingPineline:
    def __init__(self):
        pass
    
    def main(self):
        config_manager = ConfigurationManager()
        
        model_trainer_config = config_manager.get_model_trainer_config()
        
        model_trainer = ModelTrainer(config=model_trainer_config)
        model_trainer.train()
        
if __name__ == "__main__":
    try:
        logging.info("Training pineline started")
        training_pineline = TrainingPineline()
        training_pineline.main()
        logging.info("Training pineline completed")
    except Exception as e:
        raise CustomException(e,sys)