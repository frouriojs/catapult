FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json .
RUN npm ci

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server

COPY . .
ARG API_BASE_PATH
ARG NEXT_PUBLIC_FIREBASE_CONFIG
ARG DATABASE_URL
ENV API_BASE_PATH=$API_BASE_PATH
RUN npm run build

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD curl -f http://localhost:$PORT/$API_BASE_PATH/health && curl -f http://localhost:$PORT || exit 1

CMD ["npm", "start"]
