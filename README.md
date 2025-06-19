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


## 🧬 Database Migrations (Required)

If you don't see migration files in the `prisma/migrations` directory, create them using:

<details>
<summary>▶️ Running inside Docker</summary>

```bash
docker compose exec app npx prisma migrate dev --name init
```

</details>

<details>
<summary>▶️ Or locally (if database is running on localhost)</summary>

```bash
npx prisma migrate dev --name init
```

</details>

For production setup, apply existing migrations with:

```bash
npx prisma migrate deploy
```

> 📌 _Ensure migrations are run before starting the application to avoid schema issues._
```bash
npx prisma migrate dev --name init
```

## Running application (Locally without Docker)

```bash
npm start
```

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

### 🛡 Docker Image Vulnerability Scanning

To meet the security requirements, you must scan your **Docker images** (not just dependencies) for known CVEs.

Using Docker Scout:

```bash
npm run audit
```
---

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
├── Dockerfile               # Production image
├── Dockerfile.dev           # Development image with hot-reload
├── Dockerfile.postgres      # Lightweight PostgreSQL image
├── docker-compose.yml       # Production compose config
├── docker-compose.override.yml  # Overrides for development (watch mode, volumes)
├── docker-compose.remote.yml # Overrides for running pulled image from Docker Hub
├── .dockerignore            # Prevents unnecessary files from being copied to the image
├── .env                     # Environment variables
├── wait-for.sh             # Script that waits for the PostgreSQL service to be ready
├── Makefile                 # Dev/Prod helper commands
├── prisma/                  # Prisma schema and migrations
├── src/                     # Application source code
└── README.md
```

### 🚀 Running in Development Mode (with Hot Reloading)

1. **Start in dev mode with file watching:**

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up --build --watch
```

**Make changes to `.ts` files in `src/`** — they will automatically trigger reload inside the container.

---

### 🏗️ Running in Production Mode

1. **Build containers:**

```bash
docker compose -f docker-compose.yml up --build
```

📦 Pull and Run
1. Pull the image from Docker Hub:
  docker pull dmitrylotkov/home-library-app:latest

2. Create Docker network (if not already created):
   docker network create app-network

3. Start using remote compose (recommended):
   docker compose -f docker-compose.yml -f docker-compose.remote.yml up --pull always

4. Stop and remove containers and volumes:
   docker compose down -v

**Stop containers and clean volumes:**

```bash
docker compose down -v
```

Once running, the API is available at: [http://localhost:4000](http://localhost:4000)

---

### 🔁 Restart Policy & Hot Reloading (Dev Only)

- Containers use:
  ```yaml
  restart: on-failure
  ```

- In **development**, hot reloading is enabled with:

  ```yaml
  develop:
    watch:
      - action: sync
        path: ./src
        target: /app/src
        ignore:
          - node_modules/
      - action: sync
        path: ./prisma
        target: /app/prisma
      - action: rebuild
        path: package.json
      - action: rebuild
        path: package-lock.json
  ```

---

### 💾 Persistent Data

PostgreSQL container uses a **volume** to store database files:

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```