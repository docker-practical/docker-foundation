# Base Image
FROM node:10-alpine

RUN mkdir -p /src/app

WORKDIR /src/app

# NPM Install
COPY package.json /src/app/package.json

RUN npm install

# Configuring app
COPY . /src/app

EXPOSE 3000

CMD [ "npm", "start" ]
