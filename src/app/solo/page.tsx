"use client";
import SideBar from "@/components/side-bar";
import QuestionCard from "@/components/question-card";
import QuestionNav from "@/components/question-nav";
import {useEffect, useState} from "react";

const db_questions: ({title: string, desc: string, language: string, diff: string})[] = [
    {
        title: "TEMP 1",
        desc: "This is question #1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        language: "python",
        diff: "Novice"
    },
    {
        title: "TEMP 2",
        desc: "This is question #2.",
        language: "rust",
        diff: "Journeyman"
    },
    {
        title: "TEMP 3",
        desc: "This is question #3.",
        language: "kotlin",
        diff: "Novice"
    },
    {
        title: "TEMP 3",
        desc: "This is question #4.",
        language: "java",
        diff: "Novice"
    },
    {
        title: "TEMP 3",
        desc: "This is question #5.",
        language: "go",
        diff: "Novice"
    },
    {
        title: "TEMP 3",
        desc: "This is question #6.",
        language: "typescript",
        diff: "Novice"
    },
    {
        title: "TEMP 3",
        desc: "This is question #7.",
        language: "javascript",
        diff: "Novice"
    },
    {
        title: "TEMP 3",
        desc: "This is question #8.",
        language: "c",
        diff: "Novice"
    },
    {
        title: "TEMP 3",
        desc: "This is question #9.",
        language: "cpp",
        diff: "Novice"
    },
    {
        title: "TEMP 3",
        desc: "This is question #10.",
        language: "elixir",
        diff: "Novice"
    },
]

export default function Solo() {
    let [questions, setQuestions] = useState([]);

    useEffect(() => {
        db_questions.forEach(dbq => {
            const question = <QuestionCard key={dbq.title} title={dbq.title}
                                           desc={dbq.desc}
                                           lang={dbq.language}
                                           diff={dbq.diff}/>
            setQuestions(oldQuestions => [...oldQuestions, question]);
        });
    }, []);

    return(
        <div className={"flex ml-[200px] sticky"}>
            <SideBar/>
            <div className={"flex flex-col w-full"}>
                <QuestionNav/>
                {questions}
            </div>
        </div>
    );
}