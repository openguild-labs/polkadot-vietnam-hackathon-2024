import { prismaClient } from "@/*";
import { NextRequest, NextResponse } from "next/server";

/**
 * @Note This function is used to check if the user is the owner of the project
 */


export async function POST(req: NextRequest, res: NextResponse) {
    try {

        const body = await req.json();
        let isProjectOwner = true;
        const { userAddress } = body;

        const projectsInfo = await prismaClient.project.findMany({
            where: {
                projectOwnerAddress: userAddress
            },
        });

        if (projectsInfo.length === 0) {
            isProjectOwner = false;
        }

        return NextResponse.json({ isProjectOwner }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ isProjectOwner: false }, { status: 500 });
    }

}