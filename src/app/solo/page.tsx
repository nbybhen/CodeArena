"use client";
import SideBar from "@/components/side-bar";
import QuestionCard from "@/components/question-card";
import QuestionNav from "@/components/question-nav";
import {useEffect, useState} from "react";
import db_questions from "@/fake-db";

export default function Solo() {
    let [questions, setQuestions] = useState([]);

    // Holds data from QuestionNav
    const [search, setSearch] = useState<string>("");
    const [language, setLanguage] = useState<string>("any");
    const [diff, setDiff] = useState<string>("any");

    useEffect(() => {
        console.log("Current search: ", search);
        console.log("Current language: ", language);
        console.log("Current difficulty: ",diff);

        setQuestions([]);
        db_questions.forEach(dbq => {
            console.log("ADDING QUESTION");
            const question = <QuestionCard key={dbq.title} id={dbq.id} title={dbq.title}
                                           desc={dbq.desc}
                                           langs={dbq.languages}
                                           diff={dbq.diff}/>
            setQuestions(oldQuestions => [...oldQuestions, question]);
        });

        console.log("Questions.len", questions.length);

        function filterQuestions(question) {
            return ( (question.props.title.toLowerCase().includes(search.toLowerCase()) || search === "")
                && (question.props.langs.includes(language) || language === "any")
                && (question.props.diff.toLowerCase() === diff || diff === "any"));
        }

        setQuestions(oldQuestions => oldQuestions.filter(filterQuestions));
    }, [search, language, diff]);

    return(
        <div className={"flex ml-[200px] sticky"}>
            <SideBar/>
            <div className={"flex flex-col w-full"}>
                <QuestionNav setSearch={setSearch} setLanguage={setLanguage} setDiff={setDiff} />
                {questions}
            </div>
        </div>
    );
}