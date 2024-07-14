import {NextResponse} from "next/server";
import supabase from "@/utils/supabase";

export async function GET(){
    try {
        const {data, err} = await supabase.from("users").select("id, username").limit(100);

        if(err) {
            console.log("Error! ", err);
            return NextResponse.json({error: err.message, status: 400})
        }

        return NextResponse.json({users: data});
    } catch (e) {
        return NextResponse.json({error: e.message, status: 400});
    }
}