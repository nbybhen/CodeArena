import {getDataFromToken} from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import supabase from "@/utils/supabase";

export async function GET(request: NextRequest) {
    try {
        const user = getDataFromToken(request);

        return NextResponse.json({
            message: "User found!",
            user: user
        });
    } catch (err: any) {
        console.log("Couldn't find user!");
        return NextResponse.json({ error: "User not found!", status: 400 });
    }
}
