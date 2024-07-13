import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const users = await supabase.from("users").select().limit(100);

        const {data, error} = await supabase.from("question_list").select().limit(100);

        console.log("Questions: ", data);

        //console.log("Errors: ",error);

        const languages = await supabase.from("question_langs").select().limit(100);

        console.log("Langs Test: ", languages.data);

        return NextResponse.json({
            message: "Question data GET successfully!",
            questions: data,
            langs: languages.data
        });
    } catch (err) {
        return NextResponse.json({
            error: "Unable to GET from supabase.",
            status: 400,
        });
    }
    


}