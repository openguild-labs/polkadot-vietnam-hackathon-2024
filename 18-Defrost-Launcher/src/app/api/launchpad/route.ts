import { prismaClient } from "@/*";
import { DBProject, ProjectStatus } from "@/interfaces/interface";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const projectList = await prismaClient.project.findMany();
    const launchpadData = await prismaClient.launchpad.findMany();

    const investedProjects: DBProject[] = projectList.map((project) => {
      const presentTime = new Date().getTime() / 1000;
      const projectStartTime = project.startDate.getTime() / 1000;
      const status: ProjectStatus =
        projectStartTime > presentTime ? "upcoming" : "pending";
      return {
        id: project.id,
        projectID: project.projectID,
        projectOwnerAddress: project.projectOwnerAddress,
        description: project.description,
        shortDescription: project.shortDescription,
        projectImageUrls: project.projectImageUrls,
        txnHashCreated: project.txnHashCreated,
        projectTitle: project.projectTitle,
        projectLogoImageUrl: project.projectLogoImageUrl,
        endDate: project.endDate,
        startDate: project.startDate,
        isWithdrawn: project.isWithdrawn,
        status: status,
      };
    });

    return NextResponse.json(
      { projectList: investedProjects, launchpadData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
