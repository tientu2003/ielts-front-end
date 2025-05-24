import { NextResponse } from "next/server";
import {getAccessToken, getSessionUser} from "@/components/util/auth";


const speakingServiceUrl = process.env.NEXT_PUBLIC_SPEAKING_SERVICE_URL;
export async function POST(req:Request){
    const accessToken = await getAccessToken();
    const user_id = await getSessionUser();
    if (!user_id || !accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const response =  await fetch(`${speakingServiceUrl}/api/speaking/user/answer`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: req.body,
        duplex: "half"
    } as RequestInit)

    const id:string = await response.text();
    return NextResponse.json({ id: id });
}

