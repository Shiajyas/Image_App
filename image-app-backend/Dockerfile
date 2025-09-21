# image-app-backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

COPY .env .env

EXPOSE 3001

CMD ["node", "dist/server.js"]
