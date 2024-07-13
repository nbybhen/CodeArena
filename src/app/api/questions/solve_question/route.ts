import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";
import {getDataFromToken} from "@/helpers/getDataFromToken";

export default async function POST(request: NextRequest) {
    try {
        const user_id = await getDataFromToken(request);
        const reqBody = request.json();
        const {q_id, solution, language} = reqBody;

        const {err} = await supabase.from("question_completed").insert({user_id: user_id, q_id: q_id, solution: solution, language: language });

    } catch(e) {
        NextResponse.json({
           error: e.message,
           status: 400
        });
    }
}