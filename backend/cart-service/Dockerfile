# Dockerfile for backend services
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# The port will be set by the environment variable in docker-compose
# EXPOSE is for documentation purposes
EXPOSE 4002

CMD [ "node", "index.js" ]