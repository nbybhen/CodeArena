import { connect } from "@/db-config/db-config";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        console.log("reqBody", reqBody);

        // Check if users exist
        const user = await User.findOne({ email });

        console.log("User: ", user);

        if (user) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }

        const newUser = new User({
            username,
            email,
            password,
        });

        console.log("SAVING USER");

        const savedUser = await newUser.save();
        console.log("savedUser: ", savedUser);

        return NextResponse.json({
            message: "User created succcessfully.",
            success: true,
            savedUser,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
