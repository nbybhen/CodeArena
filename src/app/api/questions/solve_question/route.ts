import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";
import {getDataFromToken} from "@/helpers/getDataFromToken";

interface Solution {
    id: number,
    user_id: number,
    q_id: string,
    solution: string,
    language: string
}

export async function POST(request: NextRequest) {
    try {
        const user_id = await getDataFromToken(request);
        const reqBody = await request.json();
        const {q_id, solution, language} = reqBody;
        console.log("")

        const solved = await supabase.from("questions_completed").select().eq("user_id", user_id);

        console.log("Solved: ", solved);

        let completed = false;

        solved.data.forEach((dbs: Solution) => {
            if(dbs.user_id === user_id && dbs.q_id === dbs.q_id && dbs.language === language){
                completed = true;
                console.log("COMPLETED IS TRUEEEE\n\n");
            }
        });

        if(completed) {
            return NextResponse.json({
                error: "User already solved this question",
                status: 400
            });
        }

        console.log("UUID: ", q_id);

        //const {err} = await supabase.from("questions_completed").insert({user_id: 20, q_id: "TESTING", solution: "TESTING", language: "TEST"});

        const {data, error} = await supabase.from("questions_completed").insert({user_id: user_id, q_id: q_id, solution: solution, language: language }).select();

        if(error) {
            console.log("Error: ",error);
        }

        console.log("ENTERED DATA", data);
        console.log("User_id: ", user_id, "Q_id: ", q_id, "Solution: ", solution, "Language:", language);

        return NextResponse.json({
            message: "Successfully solved question!",
            success: true
        });

    } catch(e) {
        NextResponse.json({
           error: e.message,
           status: 400
        });
    }
}