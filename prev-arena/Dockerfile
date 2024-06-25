FROM homebrew/brew

WORKDIR /usr/CodeArena

COPY package.json .

COPY server.ts .

COPY api.ts .

RUN sudo chown -R $(whoami) /usr/CodeArena

RUN brew install node

RUN npm i --legacy-peer-deps

EXPOSE 4000

CMD ["./node_modules/.bin/tsx", "server.ts"]
