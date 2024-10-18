![EG_CompleteLogo_Blue-on-Transparent_04-27-2023](https://github.com/user-attachments/assets/38867f73-fc91-41b9-b62b-d8eac337145d)

# Running the ExpediaResearch Setup with Docker: 

## Prerequisites

Before you start, ensure you have the following installed:

- **Docker**: Download and install from [here](https://www.docker.com/get-started).

### Step 1: Build the Docker Image

1. **Navigate to the Project Directory**: In your terminal, go to the directory where the `Dockerfile` and `docker-compose.yml` file are located:

   ```bash
   cd /path/to/ExpediaResearch
   ```

2. **Build the Docker Image**: Use the `docker-compose build` command to build the image(s) defined in your `docker-compose.yml` file:

   ```bash
   docker-compose build
   ```

3. **Verify the Build**: After the build completes, verify that the image was created by running:

   ```bash
   docker images
   ```

   You should see the image listed with the name specified in the `docker-compose.yml` file.

---

### Step 2: Start the Application with Docker Compose

Once the Docker images are built, you can start the entire application stack using Docker Compose.

1. **Run `docker-compose up`**: This command will start all the services defined in your `docker-compose.yml` file. It will also automatically build any images if changes are detected or if they have not been built yet.

   ```bash
   docker-compose up
   ```

2. **Run in Detached Mode** _(Optional)_: If you prefer to run the containers in the background, use the `-d` flag:

   ```bash
   docker-compose up -d
   ```

   This will run the containers in detached mode, allowing you to continue using the terminal while the application runs in the background.

3. **Verify the Application is Running**: Once the command finishes, you should see logs from the various services in the terminal. If everything is set up correctly, the application should now be accessible on the ports defined in the `docker-compose.yml` file.

   For example, if the application is running on port `8080`, you can access it by visiting:

   Server

   ```
   http://localhost:8000
   ```

   Frontend

   ```
   http://localhost:3000
   ```

---

### Step 3: Stopping and Managing Containers

1. **Stop the Application**: To stop the running containers, press `CTRL + C` in the terminal where `docker-compose up` is running, or run the following command in a new terminal window:

   ```bash
   docker-compose down
   ```

   This will stop and remove the containers, networks, and any volumes created by Docker Compose.

2. **Check Container Logs**: If you need to debug or monitor what's happening in the containers, you can check the logs for a specific service by running:

   ```bash
   docker-compose logs service-name
   ```

   Replace `service-name` with the actual name of the service as defined in your `docker-compose.yml` file.

3. **Rebuild and Restart Containers**: If you've made changes to the code or configuration and need to rebuild the images and restart the containers, run:

   ```bash
   docker-compose up --build
   ```

   This will rebuild the Docker images and restart all the services.

---

### Additional Notes:

- **Environment Variables**: If your project uses environment variables (e.g., a `.env` file), ensure that they are correctly configured in the `docker-compose.yml` file or passed to Docker during runtime. Docker Compose will automatically load variables from a `.env` file in the same directory.
- **Volumes**: If the setup includes persistent volumes (for databases, etc.), they will be retained even after the containers stop. To remove them along with the containers and networks, use:

  ```bash
  docker-compose down --volumes
  ```

- **Accessing Services in Containers**: If your `docker-compose.yml` file includes multiple services (e.g., a database service), you can access them via their service names.

---

By following these steps, you can efficiently run and manage the **ExpediaResearch** application using Docker and Docker Compose.
