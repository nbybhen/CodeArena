# CodeArena

CodeArena is a web application designed for users learning how to program.

## Installation & Startup

```bash
# Installs necessary dependencies
yarn install

# Hosts website locally
yarn run dev
```

Currently the TS server is being transferred over to [a Rust implementation](https://github.com/nbybhen/rust-ws), and so it may not work properly. 
Clone the `rust-ws` repository and run `cargo run` in order to start up the CodeArena server.

**Note: You must have cargo installed on your machine in order to run the server.**

[//]: # (In order to run code within the editor, you can either run the server locally with `tsx server/server.ts`, or you can run the `Dockerfile` with the below instructions:)

[//]: # (```bash)

[//]: # (# Builds the Dockerfile)

[//]: # (docker build -t <name> .)

[//]: # ()
[//]: # (# Runs the Docker container on the specified port)

[//]: # (docker run -p <client-port>:<server-port> <name>)

[//]: # (```)

[//]: # ()
[//]: # (The server and Dockerfile are currently setup to run on `4000:4000`, but that can be changed within the `server.ts`, `Dockerfile`, and `src/App.tsx` files manually.)

[//]: # ()
[//]: # (Due to constant early changes being made, the Dockerfile isn't fully fleshed out and most development is ran and tested on an M1 Mac.)
