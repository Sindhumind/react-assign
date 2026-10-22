FROM node:24-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build \
    && mkdir -p /app/uploads \
    && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "start"]