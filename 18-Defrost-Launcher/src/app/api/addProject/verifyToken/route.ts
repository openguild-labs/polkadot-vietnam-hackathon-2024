import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    let { contractAddress, POAddress, networkName }: {
        contractAddress: string;
        POAddress: string;
        networkName: string
    } = body;

    const devNetwork: string = process.env.DEV_NETWORK_NAME ?? "shibuya";
    if (!networkName) {
        networkName = devNetwork;
    }

    if (!contractAddress) {
        return NextResponse.json({
            error: "contract address not provided"
        }, { status: 400 });
    }

    if (!POAddress) {
        return NextResponse.json({
            error: "PO address not provided"
        }, { status: 400 });
    }

    // Normalize EVM address format
    contractAddress = contractAddress.trim().toLowerCase();
    POAddress = POAddress.trim().toLowerCase();

    // subscan API to get EVM contract details
    const providerUrl = `https://${networkName}.api.subscan.io/api/scan/evm/contract`;
    try {
        const response = await fetch(providerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: contractAddress,
            }),
        });

        if (!response.ok) {
            throw new Error("failed to fetch provider API");
        }

        const responseData = await response.json();
        const contractInfo = responseData["data"];
        if (!contractInfo) {
            return NextResponse.json({
                error: "contract info not found on the network",
            }, { status: 400 });
        };

        const deployerAddress =
            (contractInfo["deployer"] as string)
                ?.trim()
                ?.toLocaleLowerCase();

        if (!deployerAddress) {
            return NextResponse.json({
                error: "contract deployer address not available",
            }, { status: 500 });
        }

        if (POAddress !== deployerAddress) {
            return NextResponse.json({
                deployedByPO: false,
                network: networkName,
            }, { status: 200 });
        }

        return NextResponse.json({
            deployedByPO: true,
            network: networkName,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        NextResponse.json({
            error: "failed to verify token address",
            details: error,
        }, { status: 500 });
    }
}
