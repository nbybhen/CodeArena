import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import supabase from "@/utils/supabase";
import {getDataFromToken} from "@/helpers/getDataFromToken";

export default async function updateToken(request: NextRequest) {
    try {
        const user = getDataFromToken(request);
        console.log("UPDATE TOKEN USER: ", user);

        const email = user.email;

        const {data, error} = await supabase.from('users').select().eq('email', email);

        let response = NextResponse.json({message: "Successfully updated token!", success: true});

        const tokenData = {
            id: data[0].id,
            username: data[0].username,
            email: data[0].email,
            ranking: data[0].ranking,
            score: data[0].score
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1hr" });

        //@ts-ignore
        response.cookies.set("token", token, {
            httpOnly: true,
        });

    } catch (e) {
        throw new Error(e.message);
    }
}