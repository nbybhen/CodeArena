import { connect } from "@/db-config/db-config";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log("reqBody:", reqBody);

        // Check if user exists
        const user = await User.findOne({ email });
        console.log("User: ", user);

        if (!user) {
            return NextResponse.json({ error: "User does not exist." }, { status: 400 });
        }

    
        if (!(password === user.password)) {
            return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
        }

        // Creates token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1hr" });

        const response = NextResponse.json({ message: "Login successful.", success: true });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
