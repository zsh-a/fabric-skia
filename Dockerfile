# syntax=docker/dockerfile:1
FROM node:slim
RUN apt-get update && apt-get -y install python2.7 build-essential libfontconfig-dev
WORKDIR /jsdom
RUN yarn 
WORKDIR /fabric-skia
COPY . .
RUN npm install
CMD ["node", "main.js"]