import { connect } from "@/db-config/db-config";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Login successful!",
            success: true,
        });
        //@ts-ignore
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        
        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message, status: 500});
    }
}
