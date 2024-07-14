import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {id} = reqBody;

        let question_list = await supabase.from("question_list").select().eq('id', id).limit(50);

        let question_langs = await supabase.from("question_langs").select().eq('q_id', id).limit(50);


        return NextResponse.json({
            question_data: question_list.data[0],
            question_langs: question_langs.data,
            success: true});
    } catch (e) {
        console.log("Error fetching individual question: ", e);
        return NextResponse.json({error: "Error fetching question", status: 400});
    }

}