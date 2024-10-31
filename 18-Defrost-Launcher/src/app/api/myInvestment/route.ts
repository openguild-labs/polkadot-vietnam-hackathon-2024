import { prismaClient } from "@/*";
import { DBProject, ProjectStatus } from "@/interfaces/interface";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { userAddress } = body;

        // list of investments that user with 'useraAddress' has made
        const investmentsMade = await prismaClient.investEvent.findMany({
            where: {
                userAddress: userAddress as string,
            },
            select: {
                amount: true,
                project: true
            }
        });


        investmentsMade.forEach((investment) => {
            console.log(`
                Project Id: ${investment.project.projectID}
                Amount Invested: ${investment.amount}
                `);
        });

        // transform data for better frontend integration
        const investedProjects: DBProject[] = investmentsMade.map((investment) => {
            const presentTime = new Date().getTime() / 1000;
            const projectEndTime = investment.project.endDate.getTime() / 1000;
            const status: ProjectStatus = presentTime > projectEndTime ? "ended" : "pending";
            return {
                ...investment.project,
                amount: investment.amount,
                status: status,
            }
        })
        console.log(investedProjects);

        return NextResponse.json({ investedProjects }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
