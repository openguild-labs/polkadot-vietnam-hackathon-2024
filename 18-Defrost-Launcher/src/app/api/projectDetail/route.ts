import { prismaClient } from "@/*";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const projectId = body;
        const projectDetailsData = await prismaClient.project.findMany({
            where: {
                projectID: projectId
            }
        });

        return NextResponse.json({ success: true, projectDetailsData }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }

}