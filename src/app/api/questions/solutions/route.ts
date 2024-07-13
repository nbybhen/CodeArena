import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";

export async function GET(request: NextRequest) {
    try {
        let q_id = request.nextUrl.searchParams.get("q_id");

        const {data, err} = await supabase.from("question_completed").select().eq('q_id', q_id);

        console.log("Solutions: ", data);

        return NextResponse.json({
            solutions: data,
            success: true
        });

    } catch (e) {
        return NextResponse.json({error: e.message, status: 400})
    }

}