import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log("reqBody:", reqBody);

        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

        // Check if user exists
        const {data, error} = await supabase.from('users').select('*').eq('email', email);
        console.log("User: ", data);

        if (!data) {
            //@ts-ignore
            return NextResponse.json({ error: "User does not exist." }, { status: 400 });
        }

    
        if (!(password === data[0].password)) {
            //@ts-ignore
            return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
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
        //@ts-ignore
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
