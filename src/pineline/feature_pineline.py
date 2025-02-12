from src.configuration import ConfigurationManager
from src.components.data_ingestion import DataIngestion
from src.components.data_validation import DataValidation
from src.components.data_transformation import DataTransformation
from src.logger import logging
import sys
from src.exception import CustomException

class FeaturePineline:
    def __init__(self):
        pass
    
    def main(self):
        config_manager = ConfigurationManager()
        
        data_ingestion_config = config_manager.get_data_ingestion_config()
        data_validation_config = config_manager.get_data_validation_config()
        data_transformation_config = config_manager.get_data_transformation_config()
        
        data_ingestion = DataIngestion(config=data_ingestion_config)
        data_validation = DataValidation(config=data_validation_config)
        data_transformation = DataTransformation(config=data_transformation_config)
        
        data_ingestion.download_file()
        data_ingestion.extract_zip_file()
        data_validation.validate()
        data_transformation.transform()
        
if __name__ == "__main__":
    try:
        logging.info("Feature pineline started")
        feature_pineline = FeaturePineline()
        feature_pineline.main()
        logging.info("Feature pineline completed")
    except Exception as e:
        raise CustomException(e,sys)