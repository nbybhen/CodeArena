"use client";
import SideBar from "@/components/side-bar";
import QuestionCard from "@/components/question-card";
import QuestionNav from "@/components/question-nav";
import {useEffect, useState} from "react";
import db_questions from "@/utils/fake-db";
import axios from "axios";

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

        async function getQuestions() {
            const response = await axios.get("/api/questions/get_questions");
            console.log("Response: ", response);

            const questions = response.data.questions;
            const languages = response.data.langs;
            setQuestions([]);

            questions.forEach((dbq) => {
                console.log("ADDING QUESTION");

                let langs = [];
                languages.forEach((dbl) => {
                    if(dbl.q_id === dbq.id) {
                        langs.push(dbl.language);
                    }
                });
                const question = <QuestionCard key={dbq.title} id={dbq.id} title={dbq.title} 
                desc={dbq.desc} langs={langs} diff={dbq.difficulty} />
                setQuestions(oldQuestions => [...oldQuestions, question]);
            });

            function filterQuestions(question) {
                console.log("Question title: ", question.props.title);
                return ( (question.props.title.toLowerCase().includes(search.toLowerCase()) || search === "")
                    && (question.props.langs.includes(language) || language === "any")
                    && (question.props.diff.toLowerCase() === diff || diff === "any"));
            }

            setQuestions(oldQuestions => oldQuestions.filter(filterQuestions));

            console.log("Questions.len", questions.length);

        }

        getQuestions();

    }, [search, language, diff]);

    return(
        <div className={"flex sticky"}>
            <SideBar/>
            <div className={"flex flex-col w-full"}>
                <QuestionNav setSearch={setSearch} setLanguage={setLanguage} setDiff={setDiff} />
                {questions}
            </div>
        </div>
    );
}