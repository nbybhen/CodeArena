"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { XTerm } from "xterm-for-react";
import { Editor } from "@monaco-editor/react";
import {Toaster} from "react-hot-toast";
import SideBar from "@/components/side-bar";

export default function Dashboard() {
    let xTermRef = useRef(null);
    let editorRef = useRef(null);
    let [input, setInput] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState({ name: "python", default: `print("Hello Python!")` });
    let socket = useRef(null);


    useEffect(() => {
        // Socket connection should only be created once per page. When making changes during development,
        // the page will have to be manually reloaded to ensure only one connection exists.
        // https://socket.io/how-to/use-with-react#hot-module-reloading
        async function connect() {
            //@ts-ignore
            socket.current = io("ws://localhost:4000");
        }

        connect();

        socket.current.on("return", (msg: any) => {
            console.log("Server said: ", msg);
        });

        socket.current.on("response", (msg: any) => {

            try {
                console.log("Parsed message!", msg);
                xTermRef.current.terminal.clear();
                xTermRef.current.terminal.reset();
                console.log(`Terminal Data: ${xTermRef.current.terminal}`);
                if (!msg.endsWith("\n")) {
                    msg += "\r\n";
                }
                xTermRef.current.terminal.write(msg);
            } catch (err) {
                console.log("Malformed message from terminal: ", msg);
                console.log(err);
                return;
            }
        });

        // Statically sets the terminal size on mount (col, row)
        xTermRef.current.terminal.resize(75, 40);
    }, [input, xTermRef, socket]);

    function handleChange(event: any) {
        switch (event.target.value) {
            case "python":
                setSelectedValue({ name: event.target.value, default: "print(f'Hello Python!')" });
                break;
            case "cpp":
                setSelectedValue({
                    name: event.target.value,
                    default: `#include <iostream>
int main() {
  std::cout << "Hello C++!" << std::endl;
}`,
                });
                break;
            case "c":
                setSelectedValue({
                    name: event.target.value,
                    default: `#include <stdio.h>
int main() {
    //printf() displays the string inside quotation
    printf("Hello C!");
    return 0;
}`,
                });
                break;
            case "typescript":
                setSelectedValue({ name: event.target.value, default: `console.log("Hello TypeScript!");` });
                break;
            case "rust":
                setSelectedValue({
                    name: event.target.value,
                    default: `fn main() {
  println!("Hello Rust!");
}`,
                });
                break;
            case "kotlin":
                setSelectedValue({
                    name: event.target.value,
                    default: `println("Hello Kotlin!")`,
                });
                break;
            case "javascript":
                setSelectedValue({ name: event.target.value, default: `console.log("Hello JavaScript!")` });
                break;
            case "java":
                setSelectedValue({
                    name: event.target.value,
                    default: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}`,
                });
                break;
            case "go":
                setSelectedValue({
                    name: event.target.value,
                    default: `package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello Go!");
}
`,
                });
                break;
            case "elixir":
                setSelectedValue({ name: event.target.value, default: String.raw`IO.puts("Hello Elixir!\n")` });
                break;
            default:
                setSelectedValue({ name: event.target.value, default: "No default implementation." });
                break;
        }
    }

    function linkEditor(editor) {
        editorRef.current = editor;
    }

    function handleClick() {
        console.log("Button clicked!");
        socket.current.emit("message", { xlang: selectedValue.name, code: editorRef.current.getValue(), is_ide: true });
    }

    return (
        <div className="bg-primary flex w-screen h-screen">
            <div className={"float-left"}>
                <SideBar/>
            </div>
            <div className={"flex flex-col w-full justify-center"}>
                <div className={"flex items-center justify-center h-12"}>
                    <div className={"text-lg font-bold"}>Language:</div>
                    <select className="text-lg m-2" value={selectedValue.name} onChange={handleChange} name="languages" id="languages">
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="rust">Rust</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>

                        <option value="typescript">TypeScript</option>
                        <option value="kotlin">Kotlin</option>
                        <option value="java">Java</option>
                        <option value="go">Go</option>
                        <option value="elixir">Elixir</option>
                    </select>

                    <button
                        className="inline-block m-1 shrink-0 rounded-md border border-blue-600 bg-blue-600 px-5 text-lg text-white transition hover:bg-transparent hover:text-blue-600  active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                        onClick={handleClick}>
                        Run
                    </button>
                </div>

                <Toaster position={"top-center"} />
                <header>
                    <div className={"flex items-center justify-center "}>
                        <div className={""}>
                            <Editor height={"730px"} width={"620px"} options={{ fontSize: 14 }} language={selectedValue.name} value={selectedValue.default} onMount={linkEditor} theme={"vs-dark"} />
                        </div>

                        <div className={""}>
                            <XTerm
                                ref={xTermRef}
                                onData={(data: string) => {
                                    setInput(data);
                                    console.log(`data: ${data}`);
                                    xTermRef.current.terminal.write(data);
                                }}
                                onKey={(event: { domEvent: { key: string } }) => {
                                    if (event.domEvent.key === "Backspace") {
                                        if (input) {
                                            xTermRef.current.terminal.write("\b \b");
                                        }
                                    }
                                    if (event.domEvent.key === "Enter") {
                                        if (input) {
                                            xTermRef.current.terminal.write("\r\n");
                                        }
                                    }
                                }} />
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
}
