FROM node:16

WORKDIR /

COPY package*.json ./

COPY . .

RUN npm install

CMD [ "node", "index.js" ]

EXPOSE 3001