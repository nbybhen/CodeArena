import {NextResponse} from "next/server";
import supabase from "@/utils/supabase";

export async function GET() {
    try {
        const {data, error} = await supabase.from("question_list").select();
        console.log("QUESTIONS: ", data);

        if(error) {
            return NextResponse.json({error, status: 404});
        }
        let question = data[Math.floor(Math.random()*data.length)];
        console.log("RANDOM QUESTION: ", question);
        return NextResponse.json({success: true, question: question});
    } catch (e) {
        return NextResponse.json({error: e.message, status: 404});
    }
}