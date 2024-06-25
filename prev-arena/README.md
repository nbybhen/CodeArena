# CodeArena
CodeArena is a web application designed for users learning how to program.

## Installation & Startup
```bash
# Installs necessary dependencies
npm install --legacy-peer-deps

# Hosts website locally
npm run start
```

In order to run code within the editor, you can either run the server locally with `tsx server.ts`, or you can run the `Dockerfile` with the below instructions:
```bash
# Builds the Dockerfile
docker build -t <name> .

# Runs the Docker container on the specified port
docker run -p <client-port>:<server-port> <name>
```

The server and Dockerfile are currently setup to run on `4000:4000`, but that can be changed within the `server.ts`, `Dockerfile`, and `src/App.tsx` files manually.