"use client";
import SideBar from "@/components/side-bar";
import React, {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import toast, {Toaster} from "react-hot-toast";
import {useRouter} from "next/navigation";
import axios from "axios";
export default function Clash() {
    let socket = useRef(null);
    const [status, setStatus] = useState<string>("");
    const router = useRouter();


    useEffect(() => {
        async function connect() {
            //@ts-ignore
            socket.current = io("ws://localhost:4000");
        }

        connect();

        socket.current.on("redirect", async (event: any) => {
            try {
                toast.success("Opponent found!");
                let msg = JSON.parse(event);
                console.log("RESPONSE: ", msg.question);
                console.log("ID: ", msg.question.id);
                setTimeout(() => {
                    router.push(`clash/${msg.question.id}`);
                }, 2000);

            } catch (e) {
                console.log("ERROR: ", e);
            }
        })

        socket.current.on('response', (event: any) => {
           try {
               let msg: {message: string} = JSON.parse(event);
               console.log("MESSAGE: ", msg.message);
               setStatus(msg.message);
           } catch (e) {
               console.log("ERROR: ", e);
           }
        });

    }, [socket]);

    function handleClick(event: any) {
        event.preventDefault();
        socket.current.emit("clash", {
            username: window.localStorage.getItem("username"),
            ranking: window.localStorage.getItem("ranking"),
            score: window.localStorage.getItem("score")
        });
    }

    return (
        <div className={"flex h-screen bg-primary"}>
            <Toaster position={"top-center"} />
            <SideBar/>
            <div className={"border-2 border-white flex flex-col items-center justify-center w-full"}>
                <p>{status}</p>
                <button onClick={handleClick} className={"text-xl p-7 bg-green-700 hover:bg-green-800 transition rounded"}>Enter Queue</button>
            </div>
        </div>
    );
}
