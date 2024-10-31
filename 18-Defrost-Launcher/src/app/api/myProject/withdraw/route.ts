import { prismaClient } from "@/*";
import { NextRequest, NextResponse } from "next/server";
import { DBProject, ProjectStatus } from "@/interfaces/interface";
import { dateInput } from "@nextui-org/react";
import next from "next";

/**
 * @Note This function is used to query the postgres database to get all the projects created by the user
 */

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();

    const { projectId } = body;
    try {
        console.trace(`Updating withdraw status for project with id: ${projectId}`);
        if (!projectId) {
            return NextResponse.json({
                success: false,
                error: "missing projectId",
            }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            data: null,
            message: "Error updating withdraw status of project"
        }, { status: 500 });
    }

}
