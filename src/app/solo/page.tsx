import SideBar from "@/components/side-bar";
import QuestionCard from "@/components/question-card";
import QuestionNav from "@/components/question-nav";

export default function Solo() {
    return(
        <div className={"flex"}>
            <SideBar/>
            <div className={"flex flex-col w-full"}>
                <QuestionNav/>
                <QuestionCard/>
            </div>
        </div>
    );
}