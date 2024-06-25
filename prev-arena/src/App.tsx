import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { XTerm } from "xterm-for-react";
import { FitAddon } from "xterm-addon-fit";

import { Editor, EditorProps, MonacoDiffEditor } from "@monaco-editor/react";

export default function App() {
    let xTermRef = useRef(null);
    let editorRef = useRef(null);
    let [input, setInput] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState({ name: "python", default: `print("Hello Python!")` });
    let socket = useRef(null);

    const fitAddon = new FitAddon();

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
                return;
            }
        });

        console.log("Input: ", input);
        console.log("input charcode: ", input.charCodeAt(0));
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
            <header className="App-header">
                <div style={{ marginBottom: "50px", display: "flex" }}>
                    <div style={{ marginRight: "20px" }}>
                        <Editor height={"90vh"} width={"50vw"} options={{ fontSize: 15 }} language={selectedValue.name} value={selectedValue.default} onMount={linkEditor} theme={"vs-dark"} />
                    </div>

                    <div className={"terminal"}>
                        <XTerm
                            ref={xTermRef}
                            addons={[fitAddon]}
                            onData={(data: string) => {
                                setInput(data);
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
                                        // setEntries(oldArray => [...oldArray, input]);
                                        xTermRef.current.terminal.write("\r\n");
                                    }
                                }
                            }}
                        />
                        <button style={{ width: "50px", height: "20px" }} onClick={handleClick}>
                            Run
                        </button>
                        <select value={selectedValue.name} onChange={handleChange} name="languages" id="languages">
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
                    </div>
                </div>
            </header>
        </div>
    );
}
