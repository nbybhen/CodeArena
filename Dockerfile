FROM node:latest

WORKDIR /usr/CodeArena

COPY package.json .

COPY server/server.ts .

COPY server/api.ts .

RUN npm i tsx --legacy-peer-deps

RUN npm i --legacy-peer-deps

EXPOSE 4000

CMD ["./node_modules/.bin/tsx", "server.ts"]