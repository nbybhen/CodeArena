import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        let supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

        const {data, error} = await supabase.from("question_list").select();

        console.log("Questions: ", data);
        console.log("Errors: ",error);

        const {lang_data, err} = await supabase.from("question_langs").select()

        console.log("Languages: ", lang_data);

        return NextResponse.json({
            message: "Question data GET successfully!",
            questions: data
        });
    } catch (err) {
        return NextResponse.json({
            error: "Unable to GET from supabase.",
            status: 400,
        });
    }
    


}