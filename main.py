from src.exception import logging
from src.pineline.feature_pineline import FeaturePineline
from src.pineline.training_pineline import TrainingPineline


STAGE_NAME = "Feature stage"

try:
    logging.info(f">>>>>> stage {STAGE_NAME} started <<<<<<")
    feature_pineline = FeaturePineline()
    feature_pineline.main()
    logging.info(f">>>>>> stage {STAGE_NAME} completed <<<<<<\n\nx==========x")
except Exception as e:
    logging.exception(e)
    raise e



STAGE_NAME = "Training stage"

try:
    logging.info(f">>>>>> stage {STAGE_NAME} started <<<<<<")
    training_pineline = TrainingPineline()
    training_pineline.main()
    logging.info(f">>>>>> stage {STAGE_NAME} completed <<<<<<")
except Exception as e:
    logging.exception(e)
    raise e