# User Management Application

## Overview
A full-stack user management application built with React, TypeScript, Node.js, Express, and PostgreSQL. The application supports user authentication, user management, and image uploads.

## Technology Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Web Server / Reverse Proxy:** Nginx
- **Containerization:** Docker and Docker Compose

## Project Structure
```text
.
├── BackEnd/
│   ├── src/
│   ├── database/
│   ├── Dockerfile
│   └── package.json
├── FrontEnd/
│   └── my-app/
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Prerequisites
- Docker Desktop with Docker Compose
- Node.js and npm (for local development)

## Run with Docker
1. Configure the required environment variables in the appropriate `.env` files.
2. Start the application from the project root:

   ```bash
   docker compose up -d --build
   ```

3. Open the application at [http://localhost](http://localhost).

## Useful Docker Commands

Check container status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Stop the application:

```bash
docker compose down
```

Rebuild the application:

```bash
docker compose up -d --build
```

## Local Development

Install dependencies separately in the backend and frontend directories:

```bash
npm install
```

Use the development scripts defined in each directory's `package.json`. Ensure the database and required environment variables are configured before starting the backend.

## Security
- Store credentials and secrets in environment variables.
- Never commit `.env` files, passwords, tokens, or other secrets.
- Validate user input and uploaded files on the server.
- Keep dependencies updated and review them regularly with `npm audit`.

## Notes
The application uses Docker Compose to run the frontend, backend, database, and Nginx reverse proxy. Database migrations run through the configured migrator service.
