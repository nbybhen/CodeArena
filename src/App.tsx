import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {io} from "socket.io-client";
import { XTerm } from 'xterm-for-react'

import { Editor } from '@monaco-editor/react';

export default function App() {
    let xTermRef = useRef(null);
    let [input, setInput] = useState<string>("");
    let [entries, setEntries] = useState([]);

    const socket = io('ws://localhost:4000');

    socket.on('return', (msg) => {
        console.log("Server said: ", msg);
    });

    function handleClick() {
        console.log("Button clicked!");
        socket.emit('message', "Message from client!");
    }

        useEffect(() => {
        console.log("Input: ", input);
        console.log("input charcode: ", input.charCodeAt(0));



        }, [input, xTermRef]);

    return (
        <div className="App">
            <header className="App-header">
                <div style={{"marginBottom": "50px"}}>
                    <Editor height={"20vh"} width={"45vw"} defaultLanguage={"python3"} defaultValue={"print(\"Hello World!\")"}/>
                    <button style={{width: "50px", height: "20px"}} onClick={handleClick}>Run</button>
                </div>
                <XTerm ref={xTermRef}
                       onData={(data: string) => {
                           setInput(data);
                           xTermRef.current.terminal.write(data);
                       }}
                       onKey={(event: { domEvent: { key: string; }; }) => {
                           if(event.domEvent.key === "Backspace") {
                               if(input) {
                                   console.log("Input: ",input,"\nLength: ",input.length);
                                   setInput(input.slice(0, input.length - 1));
                                   xTermRef.current.terminal.write("\b \b");
                               }
                           }
                           if(event.domEvent.key === "Enter") {
                               if(input) {
                                   setEntries(oldArray => [...oldArray, input]);
                                   xTermRef.current.terminal.write("\r\n");
                               }
                           }
                       }}

                />
                <div id="terminal"></div>
            </header>
        </div>
    );
}

