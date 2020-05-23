FROM node:lts-alpine
WORKDIR /usr/app
COPY package*.json ./
COPY .env ./
RUN npm install --production
COPY . .
RUN npm run build
WORKDIR /usr/app/dist
EXPOSE 8080


