FROM node:20-alpine AS base

WORKDIR /app

# Copy workspace files
COPY package.json package-lock.json* ./


# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copies backend source code into the container.
COPY . .

# Builds TypeScript application.
RUN npm run build

# Documents that Node.js application uses port 3000
EXPOSE 3000

#Starts backend when the container starts.
CMD ["npm", "start"]
