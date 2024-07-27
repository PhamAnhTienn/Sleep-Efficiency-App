import os
from Sleep_Efficiency_App import logger
from Sleep_Efficiency_App.entity.config_entity import DataTransformationConfig
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas as pd

class DataTransformation:
    def __init__(self, config: DataTransformationConfig):
        self.config = config

    def train_test_splitting(self):
        data = pd.read_csv(self.config.data_path)
        
        # cleaning and preprocessing data
        data = data.apply(lambda x: x.fillna(x.mode()[0]) if x.isnull().any() else x) # filling all null values with most frequent

        # converting some columns to binary 0 and 1
        data["Gender"] = data["Gender"].map({'Female': 0, 'Male': 1})
        data["Caffeine consumption"] = data["Caffeine consumption"].apply(lambda x: 1 if x > 0 else 0)
        data["Alcohol consumption"] = data["Alcohol consumption"].apply(lambda x: 1 if x > 0 else 0)
        data["Smoking status"] = data["Smoking status"].map({'Yes': 1, 'No': 0})
        data["Exercise frequency"] = data["Exercise frequency"].apply(lambda x: 1 if x > 1 else 0)

        #converting time columns to just the hour
        data["Bedtime"] = pd.to_datetime(data["Bedtime"]).dt.hour
        data["Wakeup time"] = pd.to_datetime(data["Wakeup time"]).dt.hour
        
        # scaling the awakenings column
        scaler = StandardScaler()
        data['Awakenings'] = scaler.fit_transform(data[['Awakenings']])

        # dropping other potential target columns
        data = data.drop(columns=["ID", "REM sleep percentage", "Deep sleep percentage", "Light sleep percentage"], axis=1)
        
        train, test = train_test_split(data)
        
        train.to_csv(os.path.join(self.config.root_dir, "train.csv"), index=False)
        test.to_csv(os.path.join(self.config.root_dir, "test.csv"), index=False)

        logger.info("Splitting data into training and testing sets")
        logger.info(train.shape)
        logger.info(test.shape)

        print(train.shape)
        print(test.shape)