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

    const { projectOwnerAddress } = body;
    console.debug(`projectOwnerAddress is: ${projectOwnerAddress}`);

    try {
        const projects = await prismaClient.project.findMany({
            where: {
                projectOwnerAddress: projectOwnerAddress as string,
            },
        });

        projects.forEach((project) => {
            console.log(`
            Project Id: ${project.id}
            Project Title: ${project.projectTitle}
            Project Description: ${project.description}
            Project Owner Address: ${project.projectOwnerAddress}
            Project Logo Image Url: ${project.projectLogoImageUrl}
            Project Image Urls: ${project.projectImageUrls}
            Start Date: ${project.startDate}
            End Date: ${project.endDate}
            Transaction Hash Created: ${project.txnHashCreated}
            `);
        });

        const projectDTOs: DBProject[] = projects.map((project) => {
            console.trace(`mapping project with id of ${project.projectID}`);

            let projectStatus: ProjectStatus = "pending";
            if (project.endDate.getTime() < new Date().getTime()) {
                projectStatus = "ended"
            }

            const DTO = {
                ...project,
                status: projectStatus,
            };
            return DTO;
        })
        return NextResponse.json({ projectsInfo: projectDTOs }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            data: null,
            message: "Error fetching projects"
        }, { status: 500 });
    }

}
