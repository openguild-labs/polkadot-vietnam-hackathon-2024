import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { email, fullName, projectId, tasks } = body;


        console.log(body);
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {

    }
}