import { Server } from "socket.io";
import {createServer} from "http";
import Session from "./api";
import {NextResponse} from "next/server";
import 'dotenv/config';
import supabase from "@/utils/supabase";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {origin: "*"}
});

let users: {id: string, username: string, ranking: string, score: number}[] = [];

interface Rival {
    [key: string]: {username: string, completion: number}
}

let matchups = {};


io.on('connection', (socket: any) => {

    console.log("LOG: Connected!", socket.id);
    socket.on('message', (code: any) => {
        //console.log("You said: ", code);
        new Session(socket, code.code, code.lang, code.ide);
        io.emit('return', "Received code!");
    });

    socket.on('clash', async ({username, ranking, score}) => {
        console.log("SUPABASE URL: ", process.env.SUPABASE_URL!);
        let room = "clash-lobby";
        socket.join(room);
        //console.log(`${username} ENTERED THE CLASH ARENA`);

        if(users.filter((user: {id: string, username: string, ranking: string, score: number}) => { return user.username == username && user.ranking == ranking && user.score == score}).length == 0) {
            users.push({id: socket.id,username, ranking, score});
        }
        //console.log("USERS: ", users);

        if(users.length == 2) {
            try {
                const {data, error} = await supabase.from("question_list").select();

                if(error) {
                    console.log("ERROR: ", error);
                }

                let question = data[Math.floor(Math.random()*data.length)];
                console.log("QUESTION: ", question);

                io.to(room).emit("redirect", JSON.stringify({message: "Opponent found!", question: question}));

                // Creates "rival" pairs
                let user1obj = {};
                let user2obj = {};

                // user1obj[users[0].username] = users[1];
                // user2obj[users[1].username] = users[0];

                matchups[users[0].username] = users[1];
                matchups[users[1].username] = users[0];

                console.log("MATCHUPS: ", matchups);

                // Clears users in queue
                users = [];
                //io.to(room).emit("match-response", JSON.stringify({message: "Here is your opponent"}));
            } catch(e) {
                console.log("ERROR RANDOMIZING: ", e);
            }
        }
        else {
            io.to(room).emit('response', JSON.stringify({message: "Waiting for opponent..."}));
        }
    });

    socket.on("in-match", ({username}) => {
        console.log("Current Player: ", username);
        console.log("Matchups: ", matchups);
        console.log("Opponent: ", matchups[username]);
        io.emit("match-response", {message: "Locked in match!", opponent: JSON.stringify(matchups[username])});
    });
});

httpServer.listen(4000, () => {
    console.log("Listening on localhost:4000!");
});
