import { prismaClient } from "@/*";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { chainConfig } from "@/config";
import { getProvider } from "@/utils/setupLocalNode";
import { ProjectPoolABI } from "@/abi";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const {
            projectId,
            userAddress,
            amount,
            chainId,
            poolAddress
        } = body;

        console.debug(`projectId is ${projectId}`);
        console.debug(`userAddress is ${userAddress}`);
        console.debug(`amount is ${amount}`);

        if (!projectId || !userAddress || !amount) {
            return NextResponse.json({
                success: false,
                message: "missing required data"
            }, { status: 400 });
        }

        await prismaClient.investEvent.create({
            data: {
                projectId: Number(projectId),
                userAddress: userAddress as string,
                amount: amount as string,
            }
        })

        // update "totalFundedProjects"
        const chainIdKey = String(chainId) as keyof typeof chainConfig;
        const rpcUrl: string | any = chainConfig[chainIdKey].rpcNodes.find(node => !!node.url);
        if (!rpcUrl) {
            console.error(`No RPC URL configured for chain with ID ${chainId}`);
            return NextResponse.json({ success: false }, { status: 500 });
        }
        const provider = getProvider(rpcUrl);
        const poolContract = new ethers.Contract(
            poolAddress,
            ProjectPoolABI,
            provider
        );

        const raisedAmount: bigint = await poolContract.getProjectRaisedAmount();
        console.log(`got raisedAmount: ${raisedAmount.toString()}`);
        const softCap: bigint = await poolContract.getProjectSoftCapAmount();
        console.log(`got softCap: ${softCap.toString()}`);

        if (raisedAmount >= softCap) {
            await prismaClient.$queryRaw`
                update "Launchpad" set "totalFundedProjects" = "totalFundedProjects" + 1
            `;
            console.log(`updated totalFundedProjects`);
        }

        // update totalRaisedAmount
        const launchpadStats = await prismaClient.launchpad.findFirst();
        if (!launchpadStats) {
            console.error("No launchpad stats found");
            return NextResponse.json({ success: false }, { status: 500 });
        }
        let totalRaisedAmount: bigint = BigInt(launchpadStats.totalRaisedAmount);
        console.log(`got current totalRaisedAmount from db: ${totalRaisedAmount}`);
        totalRaisedAmount += BigInt(amount);
        console.log(`new totalRaisedAmount: ${totalRaisedAmount}`);
        await prismaClient.launchpad.updateMany({
            data: {
                totalRaisedAmount: totalRaisedAmount.toString()
            }
        })
        console.log("updated totalRaisedAmount");

        return NextResponse.json({
            success: true
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}