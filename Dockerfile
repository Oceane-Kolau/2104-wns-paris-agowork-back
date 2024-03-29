FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY jest.config.ts ./
COPY schema.gql ./
COPY tsconfig.json ./
COPY .eslintrc.json ./

RUN npm i
COPY src src
COPY built built

CMD npm start