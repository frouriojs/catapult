FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json .
RUN npm ci

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server

COPY . .
ARG NEXT_PUBLIC_FIREBASE_CONFIG
ARG API_BASE_PATH
ARG DATABASE_URL
RUN npm run build

CMD npm start
