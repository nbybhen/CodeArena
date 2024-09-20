"use client";
import SideBar from "@/components/side-bar";
import {useEffect, useRef, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { Editor } from "@monaco-editor/react";
import { io } from "socket.io-client";
import stripAnsi from "strip-ansi";
import toast, {Toaster} from "react-hot-toast";
import axios from "axios";

interface Question {
    id: string,
    title: string,
    desc: string,
    difficulty: string,
    user_id: number,
    created_at: string
}

interface Lang {
    id: number,
    q_id: string,
    language: string,
    starter: string,
    test: string,
    solution: string,
}

export default function SoloQuestion(){
    const pathname = usePathname();
    const router = useRouter();

    const [langs, setLangs] = useState<Lang[]>([]);
    const [question, setQuestion] = useState<Question>({
        created_at: "",
        desc: "",
        difficulty: "",
        id: "",
        title: "",
        user_id: 0
    });
    let [output, setOutput] = useState<string>("");
    const [selected, setSelected] = useState<Lang>({solution: "", test: "", id: 0, language: "", q_id: "", starter: ""});

    let editorRef = useRef(null);
    let testingRef = useRef(null);
    let socket = useRef(null);
    let current_language = useRef<string | null>(null);

    useEffect(() => {
        const id = pathname.split('/').at(-1);
        console.log("Route: ", id);

        async function getQuestionData() {
            try{
                const response = await axios.post("/api/questions/get_question", {id: id});
                console.log("Question data: ", response.data.question_data);
                setQuestion(response.data.question_data);

                setLangs([]);

                console.log("Question langs: ", response.data.question_langs);

                response.data.question_langs.forEach((dbl: Lang) => {
                    console.log("Lang: ", dbl);
                    setLangs(oldLangs => [...oldLangs, dbl])
                });
                setSelected(response.data.question_langs[0]);
            } catch (e) {
                console.log("Error getting question data: ", e.message);
            }
        }

        getQuestionData();

        // Socket connection should only be created once per page. When making changes during development,
        // the page will have to be manually reloaded to ensure only one connection exists.
        // https://socket.io/how-to/use-with-react#hot-module-reloading
        async function connect() {
            //@ts-ignore
            socket.current = io("ws://localhost:4000");
        }

        async function solveQuestion() {
            try {
                await axios.post("/api/questions/solve_question", {q_id: id, solution: editorRef.current.getValue(), language: current_language.current});

            } catch (e) {
                console.log("Error solving question: ", e.message);
            }
        }

        connect();

        socket.current.on("return", (msg: any) => {
            console.log("Server said: ", msg);
        });

        socket.current.on("response", (msg: string) => {
            console.log("TERMINAL PROCESSED!", msg);

            try {
                console.log("Parsed message!", msg);
                if (!msg.endsWith("\n")) {
                    msg += "\r\n";
                }
                //console.log("Exit code: ", msg)
                if(msg === 0) {
                    console.log("FINISHED QUESTION!");
                    toast.success("Question Completed!");
                    solveQuestion();
                    setTimeout(() => {
                        router.push(`/solo/${id}/complete`);
                    }, 1000);
                    return;
                }
                setOutput(stripAnsi(msg));
                console.log("New output: ",output);
            } catch (err) {
                console.log("Malformed message from terminal: ", msg);
                console.log(err);
                return;
            }
        });

    }, [current_language]);

    function handleClick() {
        console.log("Button clicked!");
        current_language.current = selected.language;
        console.log("Editor: ",editorRef.current.getValue());
        console.log("Testing Editor: ", testingRef.current.getValue());
        let agg = selected.solution + "\n" + editorRef.current.getValue() + "\n" + testingRef.current.getValue();
        console.log("Aggregated code: ",agg);
        socket.current.emit("message", { lang: selected.language, code: agg, ide: false });
    }

    async function handleLanguageChange(event) {
        event.preventDefault();
        let selected_lang: Lang = langs.filter((lang: Lang) => {
            return lang.language === event.target.value;
        })[0];

        console.log("Selected: ", selected_lang);
        await setSelected(selected_lang);
        current_language.current = event.target.value;
    }

    function getLanguageOptions() {
        let languageOptions = [];
        langs.forEach((lang) => {
            languageOptions.push(<option key={lang.language} value={lang.language}>{lang.language}</option>);
        });
        return languageOptions;
    }

    return (
        <div className={"flex bg-primary"}>
            <Toaster position={"top-center"} />
            <SideBar/>
            <div className={"flex flex-col mt-5 w-screen h-screen"}>
                <div className={"flex"}>
                    <div className={"flex flex-col w-3/4 mb-10"}>
                        <h5 className={"text-2xl font-bold ml-5"}>
                            {question.title}
                        </h5>
                        <p className={"ml-5"}>
                            {question.desc}
                        </p>
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
                        <Editor height={"30vh"} width={"40vw"} options={{ fontSize: 14, minimap: { enabled: false} }} language={selected.language} value={selected.test} onMount={(e: any) => testingRef.current = e} theme={"vs-dark"} />
                    </div>
                    <Editor height={"80vh"} width={"40vw"} options={{ fontSize: 14 }} language={selected.language} value={selected.starter} onMount={(e: any) => editorRef.current = e} theme={"vs-dark"} />
                </div>
            </div>
        </div>
    );
}