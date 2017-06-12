FROM node:8-alpine

RUN mkdir -p /usr/src/petshop
WORKDIR /usr/src/petshop

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/petshop
RUN npm install && npm cache clean --force
COPY . /usr/src/petshop

CMD [ "npm", "start"]

EXPOSE 3456
