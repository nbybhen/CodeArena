import { Server } from "socket.io";
import {createServer} from "http";
import Session from "./api";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {origin: "*"}
});

io.on('connection', (socket: any) => {
    console.log("LOG: Connected!", socket.id);
    socket.on('message', (code: any) => {
        //console.log("You said: ", code);
        new Session(socket, code.code, code.lang, code.ide);
        io.emit('return', "Received code!");
    });

    socket.on('solo', (code: any) => {

    })
});

httpServer.listen(4000, () => {
    console.log("Listening on localhost:4000!");
});
