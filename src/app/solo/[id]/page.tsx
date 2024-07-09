"use client";
import SideBar from "@/components/side-bar";
import React, {useEffect, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import db_questions from "@/fake-db";
import { Editor } from "@monaco-editor/react";
import { io } from "socket.io-client";
import stripAnsi from "strip-ansi";
import toast from "react-hot-toast";



export default function SoloQuestion(){
    const pathname = usePathname();
    const router = useRouter();
    const question = db_questions.filter((q) => {
        return q.id == pathname.split('/').at(-1);
    })[0];

    let editorRef = useRef(null);
    let testingRef = useRef(null);
    let [input, setInput] = useState<string>("");
    let [output, setOutput] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState({ name: "python", default: `print("Hello Python!")` });

    let socket = useRef(null);

    useEffect(() => {
        const id = pathname.split('/').at(-1);
        console.log("Route: ", id);
        //console.log(question);

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

        socket.current.on("response", (event: any) => {
            console.log("TERMINAL PROCESSED!", event);

            try {
                let msg = JSON.parse(event);
                console.log("Parsed message!", msg.output);
                if (!msg.output.endsWith("\n")) {
                    msg.output += "\r\n";
                }
                console.log("Exit code: ", msg.code)
                if(msg.code === 0) {
                    console.log("FINISHED QUESTION!");
                    toast.success("Question Completed!");
                    router.push(`/solo/${id}/complete`);
                    return;
                }
                setOutput(stripAnsi(msg.output));
                console.log("New output: ",output);
            } catch (err) {
                console.log("Malformed message from terminal: ", event.data);
                console.log(err);
                return;
            }
        });

        getDefault(question.languages.at(0));

    }, []);

    function handleClick() {
        console.log("Button clicked!");
        console.log("SelectedValue: ", selectedValue.name);
        console.log("Editor: ",editorRef.current.getValue());
        console.log("Testing Editor: ", testingRef.current.getValue());
        let agg = question.solution[selectedValue.name] + "\n" + editorRef.current.getValue() + "\n" + testingRef.current.getValue();
        console.log("Aggregated code: ",agg);
        socket.current.emit("message", { lang: selectedValue.name, code: agg, ide: false });
    }

    function handleLanguageChange(event) {
        event.preventDefault();
        getDefault(event.target.value);
    }

    function getLanguageOptions() {
        let languageOptions = [];
        question.languages.forEach((lang) => {
            languageOptions.push(<option key={lang} value={lang}>{lang}</option>);
        });
        return languageOptions;
    }

    return (
        <div className={"flex bg-primary"}>
            <SideBar/>
            <div className={"flex flex-col mt-5 w-screen h-screen ml-[200px]"}>
                <div className={"flex"}>
                    <div className={"flex flex-col w-3/4 mb-10"}>
                        <h5 className={"text-2xl font-bold"}>{question.title}</h5>
                        <p className={""}>{question.desc}</p>
                    </div>
                    <div className={"w-1/4 flex justify-center items-center"}>
                        <select name="language" id="language" onChange={handleLanguageChange}>
                            {getLanguageOptions()}
                        </select>
                        <button
                            className="inline-block m-1 shrink-0 rounded-md border border-blue-600 bg-blue-600 px-5 text-lg text-white transition hover:bg-transparent hover:text-blue-600  active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                            onClick={handleClick}>
                            Run
                        </button>
                    </div>
                </div>

                <div className={"flex justify-evenly"}>
                    <div>
                        <div className={"bg-black border-2 overflow-y-auto h-[50vh] w-[40vw] break-words whitespace-pre-wrap"}>
                            <p className={"border-b text-center text-xl"}>Output</p>
                            {output}
                        </div>
                        <Editor height={"30vh"} width={"40vw"} options={{ fontSize: 14 }} language={selectedValue.name} value={question.tests[selectedValue.name]} onMount={(e: any) => testingRef.current = e} theme={"vs-dark"} />
                    </div>

                    <Editor height={"80vh"} width={"40vw"} options={{ fontSize: 14 }} language={selectedValue.name} value={question.starter[selectedValue.name]} onMount={(e: any) => editorRef.current = e} theme={"vs-dark"} />
                </div>
            </div>
        </div>
    );

    function getDefault(lang: string) {
        switch (lang) {
            case "python":
                setSelectedValue({name: lang, default: "print(f'Hello Python!')"});
                break;
            case "cpp":
                setSelectedValue({
                    name: lang,
                    default: `#include <iostream>
int main() {
  std::cout << "Hello C++!" << std::endl;
}`,
                });
                break;
            case "c":
                setSelectedValue({
                    name: lang,
                    default: `#include <stdio.h>
int main() {
    //printf() displays the string inside quotation
    printf("Hello C!");
    return 0;
}`,
                });
                break;
            case "typescript":
                setSelectedValue({name:lang, default: `console.log("Hello TypeScript!");`});
                break;
            case "rust":
                setSelectedValue({
                    name: lang,
                    default: `fn main() {
  println!("Hello Rust!");
}`,
                });
                break;
            case "kotlin":
                setSelectedValue({
                    name: lang,
                    default: `println("Hello Kotlin!")`,
                });
                break;
            case "javascript":
                setSelectedValue({name: lang, default: `console.log("Hello JavaScript!")`});
                break;
            case "java":
                setSelectedValue({
                    name: lang,
                    default: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}`,
                });
                break;
            case "go":
                setSelectedValue({
                    name: lang,
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
                setSelectedValue({name: lang, default: String.raw`IO.puts("Hello Elixir!\n")`});
                break;
            default:
                setSelectedValue({name: lang, default: "No default implementation."});
                break;
        }
    }
}