import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/*";
import { convertNumToOnChainFormat } from "@/utils/decimals";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    console.log(body);

    const {
        verifyTokenData,
        generalDetailData,
        promotionData,
        eventData,
    } = body;

    console.log("This is comb " + generalDetailData.selectedImages);
    if (!verifyTokenData || !generalDetailData || !promotionData) {
        return NextResponse.json(
            { success: false, error: "Missing data" },
            { status: 400 }
        );
    }

    console.log("General " + generalDetailData.selectedCoin);
    console.log("Promotion " + promotionData.endDate);
    console.log("eventData is:\n", eventData);

    //generalDetailPage
    const selectedVToken = generalDetailData.selectedCoin; //selectedToken address
    const selectedImages = generalDetailData.selectedImages;
    const selectedLogo = generalDetailData.selectedLogo;
    const projectTitle = generalDetailData.projectTitle;
    const shortDescription = generalDetailData.shortDescription;
    const longDescription = generalDetailData.longDescription;

    const startDate = promotionData.startDate;
    const endDate = promotionData.endDate;

    //Convert date to unix time to fit the contract uint256
    const startTimed = new Date(startDate);
    const unixTime = Math.floor(startTimed.getTime() / 1000); ///FOMRATED to uint256
    const endTimed = new Date(endDate);
    const unixTimeEnd = Math.floor(endTimed.getTime() / 1000); //FORMATED to uint256
    try {
        const project = await prismaClient.project.create({
            data: {
                projectTitle: projectTitle as string,
                projectLogoImageUrl: selectedLogo as string[],
                description: longDescription as string,
                shortDescription: shortDescription as string,
                projectImageUrls: selectedImages as string[],
                startDate: startDate as Date,
                endDate: endDate as Date,
                projectID: eventData.projectId as number,
                txnHashCreated: eventData.txnHashCreated as string,
                projectOwnerAddress: eventData.projectOwner as string,
            },
        });
        if (!project) {
            return NextResponse.json({ success: false, message: "failed to create new project" }, { status: 500 });
        }

        console.log(project);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
