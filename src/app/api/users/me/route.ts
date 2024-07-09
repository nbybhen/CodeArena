import {getDataFromToken} from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    try {
        let supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
        const userID = await getDataFromToken(request);
        const {data, error} = await supabase.from('users').select("*").eq("id", userID);

        //console.log("Data: ",data);

        return NextResponse.json({
            message: "User found!",
            data: data
        });
    } catch (err: any) {
        console.log("Couldn't find user!");
        return NextResponse.json({ error: "User not found!", status: 400 });
    }
}
