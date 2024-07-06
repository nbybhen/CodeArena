"use client";
import SideBar from "@/components/side-bar";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import db_questions from "@/fake-db";

export default function SoloQuestion(){
    const router = usePathname();

    const question = db_questions.filter((q) => {
        return q.id == router.split('/').at(-1);
    })[0];

    useEffect(() => {
        console.log("Route: ", router.split('/').at(-1));
        console.log(question);
    }, []);

    return (
        <div className={"flex bg-primary"}>
            <SideBar/>
            <div className={"flex border-2 w-full h-full ml-[200px]"}>
                HALLO
            </div>
        </div>
    );
}