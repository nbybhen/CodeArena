"use client";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import SideBar from "@/components/side-bar";
import {usePathname, useRouter} from "next/navigation";
import {io} from "socket.io-client";
import stripAnsi from "strip-ansi";
import {Editor} from "@monaco-editor/react";
import {User} from "@supabase/auth-js";

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

interface Opponent {
    id: string,
    username: string,
    ranking: string,
    score: number,
    status: string
}

export default function ClashIde() {

    const pathname = usePathname();
    const id = pathname.split('/').at(-1);
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
    const [opponent, setOpponent] = useState<Opponent>(null);
    let newOpponent = opponent;

        let editorRef = useRef(null);
    let socket = useRef(null);
    let current_language = useRef<string | null>(null);

    useEffect(() => {
        const id = pathname.split('/').at(-1);
        console.log("Route: ", id);


        async function getQuestionData() {
            try{
                const response = await axios.post("/api/questions/get_question", {id: id});
                setQuestion(response.data.question_data);

                setLangs([]);

                response.data.question_langs.forEach((dbl: Lang) => {
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

        socket.current.on("match-response", (event: any) => {
            console.log("MATCH RESPONSE: ", event);
            let tmp: Opponent = JSON.parse(event.opponent);

            console.log("TMP: ", tmp);
            // Ensures that you won't see yourself as an opponent
            if(tmp.username != window.localStorage.getItem("username")) {
                setOpponent(tmp);
                newOpponent = tmp;
            }
            console.log("CURRENT OPPONENT: ", opponent);
        });

        socket.current.on("return", (msg: any) => {
            console.log(msg);
        });

        socket.current.on("status-return", (response: Opponent) => {
            console.log("STATUS RETURN RESPONSE: ", response);
            if(response.username != window.localStorage.getItem("username")) {
                setOpponent(response);
                newOpponent = response;
            }
        });

        socket.current.on("response", (msg: any) => {
            console.log("TERMINAL PROCESSED!", event);

            try {
                console.log("Parsed message!", msg.output);
                if (!msg.output.endsWith("\n")) {
                    msg.output += "\r\n";
                }
                console.log("Exit code: ", msg.code)
                if(msg.code === 0) {
                    console.log("FINISHED QUESTION!");
                    console.log("OPPONENT: ", newOpponent);
                    socket.current.emit("change-status", newOpponent.username, "Complete");
                    console.log("OPPONENT AFTER: ", newOpponent);
                    toast.success("Question Completed!");
                    solveQuestion();
                    setTimeout(() => {
                        router.push(`/clash/${id}/complete`);
                    }, 1000);
                    return;
                }
                setOutput(stripAnsi(msg.output));
                console.log("New output: ",output);
            } catch (err) {
                console.log("Malformed message from terminal: ", msg);
                console.log(err);
                return;
            }
        });

        socket.current.emit("in-match", {username: window.localStorage.getItem("username")});

    }, [current_language]);

    async function handleClick() {
        try {
            console.log("Button clicked!");
            current_language.current = selected.language;
            console.log("Editor: ",editorRef.current.getValue());
            let response = await axios.get("/api/questions/get_solution", {
                params: {
                    q_id: id,
                    lang: selected.language
                }
            });

            let agg = selected.solution + "\n" + editorRef.current.getValue() + "\n" + response.data.data[0].test;
            console.log("Aggregated code: ",agg);
            socket.current.emit("message", { lang: selected.language, code: agg, ide: false });
        } catch (e) {
            console.log("ERRORRRRRR: ", e);
        }
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
                    <div className={"border-2 flex flex-col border-red-600"}>
                        <div className={"bg-black border-2 overflow-y-auto h-[50vh] w-[40vw] break-words whitespace-pre-wrap"}>
                            <p className={"border-b text-center text-xl"}>Output</p>
                            {output}
                        </div>
                        <div className={"bg-secondary flex flex-col items-center border-green-500 p-2 border-2"}>
                            <p className={"text-2xl mb-2"}>Opponent</p>
                            <div className={"flex w-full mb-2 justify-evenly"}>
                                <p className={"text-xl"}>{opponent ? opponent.username : "[username]"}</p>
                                <p className={"text-xl"}>{opponent ? opponent.status : "[status]"}</p>
                            </div>

                        </div>
                    </div>
                    <Editor height={"80vh"} width={"40vw"} options={{ fontSize: 14 }} language={selected.language} value={selected.starter} onMount={(e: any) => editorRef.current = e} theme={"vs-dark"} />
                </div>
            </div>
        </div>
    );
}