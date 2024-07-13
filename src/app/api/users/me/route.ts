import {getDataFromToken} from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import supabase from "@/utils/supabase";

export async function GET(request: NextRequest) {
    try {
        const userID = await getDataFromToken(request);
        const {data, error} = await supabase.from('users').select("*").eq("id", userID);

        return NextResponse.json({
            message: "User found!",
            data: data
        });
    } catch (err: any) {
        console.log("Couldn't find user!");
        return NextResponse.json({ error: "User not found!", status: 400 });
    }
}
