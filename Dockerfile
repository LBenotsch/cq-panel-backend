FROM node:10.8.0-alpine
WORKDIR /DockerImage
COPY package*.json ./
COPY coin.txt ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]