# React User Management Frontend

## Overview

This project is the frontend for a full-stack User Management Application built using React, TypeScript, and Vite. It provides a user interface for authentication and user management.

## Technology Stack

- React
- TypeScript
- Vite
- CSS
- Vitest and React Testing Library (for tests)

## Features

- User login and authentication
- User listing and management
- Create, update, and delete user records
- Search, filtering, and sorting
- Image upload support
- Form validation and user feedback messages
- Integration with the backend REST API

## Prerequisites

- Node.js and npm
- The backend API running and configured
- PostgreSQL available through the backend configuration, when required

## Installation

From the frontend directory:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal.

## Production Build

Create a production build:

```bash
npm run build
```

The generated files are placed in the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

## Testing

Run the available test suite using the script configured in `package.json`. If the project uses Vitest with a `test` script, run:

```bash
npm run test
```

## Backend Integration

The frontend communicates with the Node.js and Express backend through API requests. In Docker, Nginx routes requests to the frontend and backend.

For full-stack setup instructions, environment configuration, and Docker commands, see the root `README.md`.

## Security

- Do not store passwords, API secrets, or private credentials in frontend code.
- Do not expose server-only environment variables to the browser.
- Perform authentication, authorization, and input validation on the backend.
- Validate uploaded files on the server.