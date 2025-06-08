# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.


> ❗ Before running anything, **make sure Docker Engine is running** on your machine.  
> You can also start **Docker Desktop**, which runs Docker Engine in the background.

## Downloading

```bash
git clone https://github.com/DmitryLotkov/nodejs2025Q2-service.git
```

## Installing NPM modules

```bash
npm install
```

## Running application

```bash
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization:

```bash
npm run test
```

To run only one of all test suites:

```bash
npm run test -- <path to suite>
```

To run all tests with authorization:

```bash
npm run test:auth
```

To run only specific test suite with authorization:

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

## 📦 Docker Setup

### 🔧 Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- GNU Make — _optional for Windows_ (you can use PowerShell instead). Install with:  
  ```bash
  choco install make
  ```

### 🧱 Project Structure

```
.
├── Dockerfile              # Production
├── Dockerfile.dev          # Development (hot reload)
├── docker-compose.yml
├── docker-compose.override.yml
├── wait-for.sh
├── .env

```

### 🚀 Running the Application

1. **Build Docker images:**

```bash
docker-compose build
```

2. **Start the services:**

```bash
docker-compose up
```

3. **Stop and remove all containers and volumes:**

```bash
docker-compose down -v
```

Once running, the API will be available at: [http://localhost:4000](http://localhost:4000)

Swagger/OpenAPI docs: [http://localhost:4000/doc](http://localhost:4000/doc)

---

### 🔁 Restart Policy & Hot Reloading

- Containers are configured with:  
  ```yaml
  restart: on-failure
  ```
- **Hot reloading** is enabled via volume mounting:
  ```yaml
  volumes:
    - .:/app
    - /app/node_modules
  ```

---

### 💾 Persistent Data

PostgreSQL container uses a **volume** to store database files:

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```

This ensures your data is **not lost** when the container restarts.

You can also store logs persistently by adding this (optional):

```yaml
volumes:
  - ./postgres-logs:/var/log/postgresql
```
