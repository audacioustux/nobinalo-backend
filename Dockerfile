FROM node:12-alpine
USER audacioustux
WORKDIR /usr/src
COPY . .
RUN npm install --production --silent
EXPOSE 4081
CMD node ./build/index.js