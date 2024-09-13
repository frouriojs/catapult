FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server

COPY . .

ARG PORT=10000
ARG NEXT_PUBLIC_API_BASE_PATH=/api
ARG NEXT_PUBLIC_COGNITO_POOL_ENDPOINT
ARG NEXT_PUBLIC_COGNITO_USER_POOL_ID
ARG NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
ARG NEXT_PUBLIC_OAUTH_DOMAIN
ARG DATABASE_URL

ENV NEXT_PUBLIC_API_BASE_PATH=$NEXT_PUBLIC_API_BASE_PATH
ENV NEXT_PUBLIC_SERVER_PORT=$PORT

RUN npm run build

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD curl -f http://localhost:$PORT/$NEXT_PUBLIC_API_BASE_PATH/health && curl -f http://localhost:$PORT || exit 1

CMD ["npm", "start"]
