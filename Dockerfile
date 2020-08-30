FROM node:latest

ARG HOME_DIRECTORY=/usr/src/app

WORKDIR ${HOME_DIRECTORY}
COPY ./server.js ${HOME_DIRECTORY}/server.js
COPY ./router.js ${HOME_DIRECTORY}/router.js
COPY ./package.json ${HOME_DIRECTORY}/package.json
COPY ./public ${HOME_DIRECTORY}/public

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]