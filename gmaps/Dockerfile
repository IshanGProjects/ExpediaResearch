# Use an official Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy the server code into the container
COPY gmaps_server.py .
COPY requirements.txt .
COPY .env .

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install flask

# Expose port 8081
EXPOSE 8081

# Run the Python server
CMD ["python3", "gmaps_server.py"]

# To build the Docker image, run: docker build -t python-server .
# To run the Docker container, use: docker run -p 8081:8081 python-server

# docker-compose down --volumes
# docker-compose up --build
