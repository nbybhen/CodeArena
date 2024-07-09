import {getDataFromToken} from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    try {
        let supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
        const userID = await getDataFromToken(request);
        const {data, err} = await supabase.from('users').select("*").eq("id", userID);

        return NextResponse.json({
            message: "User found!",
            data: data
        });
    } catch (err: any) {

    }
}
