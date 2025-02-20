FROM python:3.8-slim-buster

# Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# Install AWS CLI
RUN apt update && apt install -y awscli && apt clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt setup.py /app/
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . /app/

CMD ["python3", "app.py"]
