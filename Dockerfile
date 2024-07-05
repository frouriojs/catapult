FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json .
RUN npm ci

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server

COPY . .

ARG PORT
ARG NEXT_PUBLIC_API_BASE_PATH=/api
ENV NEXT_PUBLIC_API_BASE_PATH=$NEXT_PUBLIC_API_BASE_PATH
ENV SERVER_PORT=$PORT

ARG NEXT_PUBLIC_COGNITO_POOL_ENDPOINT
ARG COGNITO_USER_POOL_ID
ARG COGNITO_USER_POOL_CLIENT_ID
ARG DATABASE_URL

RUN npm run build

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD curl -f http://localhost:$PORT/$NEXT_PUBLIC_API_BASE_PATH/health && curl -f http://localhost:$PORT || exit 1

CMD ["npm", "start"]
