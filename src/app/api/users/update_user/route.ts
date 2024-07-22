import {NextRequest, NextResponse} from "next/server";
import supabase from "@/utils/supabase";
import * as fs from "node:fs";
import sharp from "sharp";

export async function POST(request: NextRequest) {
    try {
        console.log("POSTING")
        const formData = await request.formData();
        console.log("Form data: ", formData);

        const username: string = formData.get("username") as string;
        const email: string = formData.get("email") as string;

        if(!username || !email) {
            return NextResponse.json({error: "Username and email fields must be filled.", status: 404});
        }

        if(formData.get("file") != "undefined") {
            const file = formData.get("file") as File;

            const arrayBuffer = await file.arrayBuffer();
            //const buffer = new Uint8Array(arrayBuffer);

            const buffer = await sharp(arrayBuffer).resize(120, 120).toBuffer();

            await fs.writeFile(`./public/uploads/${file.name}`, buffer, (err) => {
                if(err) {
                    console.log("ERROR WRITING TO FILE: ", err.message);
                }
            });

            console.log("URL: ", "/" + file.name);
            const {data, error} = await supabase.from("users")
                .update({username: username, email: email, img: file.name})
                .eq('email', email)
                .select();

            if(!error) {
                console.log("Newly Updated User: ", data);
                return NextResponse.json({message: "Success!", success: true});
            }
            else {
                console.log("Error!", error.message);
                return NextResponse.json({error: error.message, status: 404});
            }
        }
        else {
            const {data, error} = await supabase.from("users")
                .update({username: username, email: email})
                .eq('email', email)
                .select();

            if(!error) {
                console.log("Newly Updated User: ", data);
                return NextResponse.json({message: "Success!", success: true});
            }
            else {
                console.log("Error!", error.message);
                return NextResponse.json({error: error.message, status: 404});
            }
        }
    } catch (e) {
        return NextResponse.json({error: e.message, status: 404});
    }
}