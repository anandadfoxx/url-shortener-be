FROM node:latest

RUN mkdir -p /d`ist
COPY dist /dist
WORKDIR /dist

COPY package.json /dist/
RUN npm install

EXPOSE 8080
ENTRYPOINT [ "node", "index.js" ]