import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";

export async function GET(request: NextRequest){
    try {
        const {data, error} = await supabase.from("users")
            .select("id, username, ranking, img")
            .limit(100);

        if(error) {
            console.log("Error! ", error);
            return NextResponse.json({error: error.message, status: 400})
        }

        return NextResponse.json({users: data});
    } catch (e) {
        return NextResponse.json({error: e.message, status: 400});
    }
}