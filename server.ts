import { Server } from "socket.io";
import {createServer} from "http";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {origin: "*"}
});

io.on('connection', (socket) => {
    console.log("LOG: Connected!", socket.id);
    socket.on('message', (text) => {
        console.log("You said: ", text);
        io.emit('return', "Received message!");
    })
});

httpServer.listen(4000, () => {
    console.log("Listening on localhost:4000!");
});
