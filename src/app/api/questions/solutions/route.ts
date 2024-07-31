import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";

export async function GET(request: NextRequest) {
    try {
        let q_id = request.nextUrl.searchParams.get("q_id");
        console.log("Q_ID: ", q_id);

        const {data, error} = await supabase.from("questions_completed").select().eq('q_id', q_id);

        return NextResponse.json({
            solutions: data,
            success: true
        });

    } catch (e) {
        return NextResponse.json({error: e.message, status: 400})
    }

}