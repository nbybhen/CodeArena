import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import supabase from "@/utils/supabase";


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Check if user exists
        const {data, error} = await supabase.from('users').select('*').eq('email', email);

        if (error) {
            return NextResponse.json({ error: error.message, status: 400 });
        }

        if (!(password === data[0].password)) {
            return NextResponse.json({ error: "Incorrect password.", status: 400 });
        }

        // Creates token data
        const tokenData = {
            id: data[0].id,
            username: data[0].username,
            email: data[0].email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1hr" });

        const response = NextResponse.json({
            message: "Login successful.",
            success: true,
            username: data[0].username,
            ranking: data[0].ranking,
            score: data[0].score,
            img: data[0].img
        });

        //@ts-ignore
        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message, status: 400 });
    }
}
