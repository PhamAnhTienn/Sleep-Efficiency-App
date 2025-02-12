import os
import sys
import gdown
import urllib.request as request
import zipfile
from src.logger import logging
from src.exception import CustomException

class DataIngestion:
    def __init__(self, config):
        self.config = config

    def download_file(self):
        file_id = self.config.source_URL.split("/")[-2]
        gdrive_url = f"https://drive.google.com/uc?id={file_id}"

        # Tạo thư mục nếu chưa tồn tại
        os.makedirs(os.path.dirname(self.config.local_data_file), exist_ok=True)

        if os.path.exists(self.config.local_data_file):
            logging.info(f"File downloaded successfully: {self.config.local_data_file}")
        else:
            logging.info(f"Downloading file from {gdrive_url} to {self.config.local_data_file}")
            gdown.download(gdrive_url, self.config.local_data_file, quiet=False)
            logging.info(f"File downloaded successfully: {self.config.local_data_file}")

    def extract_zip_file(self):
        unzip_path = self.config.unzip_dir
        os.makedirs(unzip_path, exist_ok=True)

        # Giải nén file ZIP
        with zipfile.ZipFile(self.config.local_data_file, 'r') as zip_ref:
            zip_ref.extractall(unzip_path)
            logging.info(f"Extracted all files to {unzip_path}")