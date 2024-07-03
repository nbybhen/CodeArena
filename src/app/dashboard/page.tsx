"use client";
import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { XTerm } from "xterm-for-react";
import { Editor, EditorProps, MonacoDiffEditor } from "@monaco-editor/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, {Toaster} from "react-hot-toast";

export default function Dashboard() {
    let xTermRef = useRef(null);
    let editorRef = useRef(null);
    let [input, setInput] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState({ name: "python", default: `print("Hello Python!")` });
    let socket = useRef(null);

    const router = useRouter();

    async function logout(event: any) {
        event.preventDefault();
        try {
            let response = axios.get("/api/users/logout");
            console.log("Logged out successfully!", response);
            toast.success("Logged out successfully!");
            router.push("/login");
        } catch (err) {
            toast.error(err.message);
            console.log("Error logging out", err.message);
        }
    }

    useEffect(() => {
        // Socket connection should only be created once per page. When making changes during development,
        // the page will have to be manually reloaded to ensure only one connection exists.
        // https://socket.io/how-to/use-with-react#hot-module-reloading
        async function connect() {
            socket.current = io("ws://localhost:4000");
        }

        connect();

        socket.current.on("return", (msg: any) => {
            console.log("Server said: ", msg);
        });

        socket.current.on("response", (event: any) => {
            console.log("TERMINAL PROCESSED!", event);

            try {
                let msg = JSON.parse(event);
                console.log("Parsed message!", msg.output);
                xTermRef.current.terminal.clear();
                console.log(`Terminal Data: ${xTermRef.current.terminal}`);
                if (!msg.output.endsWith("\n")) {
                    msg.output += "\r\n";
                }
                xTermRef.current.terminal.write(msg.output);
            } catch (err) {
                console.log("Malformed message from terminal: ", event.data);
                console.log(err);
                return;
            }
        });

        // console.log("Input: ", input);
        // console.log("input charcode: ", input.charCodeAt(0));
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

    function linkEditor(editor: any) {
        editorRef.current = editor;
    }

    function handleClick() {
        console.log("Button clicked!");
        socket.current.emit("message", { lang: selectedValue.name, code: editorRef.current.getValue() });
    }

    return (
        <div className="App">
            <Toaster position={"top-center"} />
            <header className="App-header">
                <div style={{ marginBottom: "50px", display: "flex" }}>
                    <div style={{ marginRight: "20px" }}>
                        <Editor height={"90vh"} width={"50vw"} options={{ fontSize: 15 }} language={selectedValue.name} value={selectedValue.default} onMount={linkEditor} theme={"vs-dark"} />
                    </div>

                    <div className={"terminal"}>
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
                            }}
                        />
                        <select className="text-lg" value={selectedValue.name} onChange={handleChange} name="languages" id="languages">
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
                            className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-5 text-lg text-white transition hover:bg-transparent hover:text-blue-600  active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                            onClick={handleClick}
                        >
                            Run
                        </button>
                    </div>
                </div>
                <button
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 textarea-md font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                    onClick={logout}
                >
                    Log Out
                </button>
            </header>
        </div>
    );
}
