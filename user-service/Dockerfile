FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh ./wait-for-it.sh

RUN chmod +x ./wait-for-it.sh

RUN apk update && apk add bash && apk add --no-cache coreutils

EXPOSE 3002

CMD ["sh", "-c", "./wait-for-it.sh db:3306 -- npm run migrate && npm start"]