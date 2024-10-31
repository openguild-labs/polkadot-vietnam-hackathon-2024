import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/*"

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { projectID } = body;

        const project = await prismaClient.project.findFirst({
            where: {
                projectID: Number(projectID)
            },
            select: {
                projectTitle: true,
            }
        })
        if (!project) {
            console.debug(`project with id ${projectID} not found`);
            return NextResponse.json({
                success: false,
                error: `project with id ${projectID} not found`,
            }, { status: 404 });
        }

        console.debug(`found first project: ${project}`)
        return NextResponse.json({
            success: true,
            projectTitle: project.projectTitle
        }, { status: 200 });

    } catch (err) {
        console.error(`error while getting project title:\n${err}`);
        return NextResponse.json({
            success: false,
            error: "internal server error",
        }, { status: 500 });
    }
}