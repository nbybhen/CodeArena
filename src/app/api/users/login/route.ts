import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import supabase from "@/utils/supabase";


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log("reqBody:", reqBody);

        // Check if user exists
        const {data, error} = await supabase.from('users').select('*').eq('email', email);
        console.log("User: ", data);

        if (!data) {
            return NextResponse.json({ error: "User does not exist.", status: 400 });
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

        const response = NextResponse.json({ message: "Login successful.", success: true });

        //@ts-ignore
        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message, status: 400 });
    }
}
