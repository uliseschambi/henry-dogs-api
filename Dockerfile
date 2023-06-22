FROM node:16

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "start", "index.js" ]