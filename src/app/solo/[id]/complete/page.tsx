"use client";

import SideBar from "@/components/side-bar";
import {useEffect, useState} from "react";
import axios from "axios";
import {usePathname, useSearchParams} from "next/navigation";
import CodeSolution from "@/components/code-solution";

interface Solution {
    username: string,
    solution: string,
    language: string,
    q_id: string
}

export default function Complete() {
    let pathname = usePathname();
    const [solutions, setSolutions] = useState([]);

    async function Test() {
        let q_id = pathname.split('/').at(2);

        let response = await axios.get("/api/questions/solutions", {
            params: {q_id}
        });

        console.log("Solutions: ", response.data.solutions);

        let users = await axios.get("/api/users/get_users");

        console.log("Users: ", users.data.users);

        response.data.solutions.forEach((dbs: {id: number, user_id: number, q_id: string, solution: string, language: string}) => {
            users.data.users.forEach((user: {id: number, username: string}) => {
                if(dbs.user_id === user.id) {
                    console.log("FOUND ONEEEEEEEE");
                    let solution: Solution = {username: user.username, solution: dbs.solution, language: dbs.language, q_id: dbs.q_id};
                    setSolutions(prevSol => [...prevSol, solution]);
                }
            });
        });
    }

    function getSolutions() {
        let sols = [];
        solutions.forEach((sol: Solution) => {
            sols.push(<CodeSolution key={sol.username+sol.language+sol+sol.q_id} name={sol.username} lang={sol.language} sol={sol.solution} />)
        });
        return sols;
    }

    useEffect(() => {
        Test();
    }, []);



    return (
        <div className={"h-screen"}>
            <SideBar/>
            <div className={"w-full flex flex-col"}>
                {getSolutions()}
            </div>

        </div>
    );
}