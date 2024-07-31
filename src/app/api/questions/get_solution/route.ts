import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";

export async function GET(request: NextRequest) {
    try {
        let q_id = request.nextUrl.searchParams.get("q_id");
        let lang = request.nextUrl.searchParams.get("lang");
        console.log("Q_ID: ", q_id);
        console.log("LANG: ", lang);

        const {data, error} = await supabase.from("question_langs")
            .select("test")
            .eq("q_id", q_id)
            .eq("language", lang);

        console.log("DATA: ", data);

        if(error) {
            return NextResponse.json({error: error.message, status: 404});
        }

        return NextResponse.json({message: "Request received!", data: data, success: true});
    } catch (e) {
        return NextResponse.json({error: e.message, status: 404});
    }


}