import { NextRequest, NextResponse } from "next/server";
import {createClient} from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

        console.log("reqBody", reqBody);

        // Check if users exist
        const {data, error} = await supabase.from('users').select('*').eq('email', email);

        if(error){
            console.log("Error!");
            return NextResponse.json({ error: "Unable to get user from database.", status: 400 });
        }

        if (data && data.length) {
            console.log("User: ", data);
            return NextResponse.json({ error: "User already exists.", status: 400 });
        }

        const { err } = await supabase.from('users').insert({username: username, password: password, email: email});

        if(err) {
            console.log("Error!", err);
            return NextResponse.json({ error: "Unable to add user to database.", status: 400 });
        }

        const savedUser = await supabase.from('users').select('*').eq('email', email);
        console.log("SavedUser: ", savedUser.data);


        if(!savedUser.data) {
            return NextResponse.json({error: "Unable to add user to database.", status: 400});
        }

        return NextResponse.json({
            message: "User created successfully.",
            success: true,
            savedUser,
        });
    } catch (err: any) {
        //@ts-ignore
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
