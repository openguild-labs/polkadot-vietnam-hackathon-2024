import { NextResponse } from 'next/server';
import { prismaClient } from "@/*"; // Ensure this import is present

export async function POST(req: Request) {
    const { OTP, email, address } = await req.json();

    if (!OTP || !email || !address) {
        return NextResponse.json({ error: 'missing email, address, or OTP' }, { status: 400 });
    }

    try {
        // Verify the token against your database
        const latestOTPRecord = await prismaClient.oTP.findFirst({
            where: { email: email },
            orderBy: { createdAt: 'desc' }
        });

        // check if token is valid
        const isValid = (latestOTPRecord && OTP === latestOTPRecord.code);
        if (!isValid) {
            return NextResponse.json({ error: `invalid OTP: ${OTP}` }, { status: 400 });
        }

        // if valid, update the user's email verification status in the database
        const updatedUser = await prismaClient.user.update({
            where: {
                address: address,
            },
            data: {
                emailVerified: true, // Assuming you have an emailVerified field
                email: email,
            }
        });
        if (!updatedUser) {
            return NextResponse.json({ error: 'cannot update email verification state' }, { status: 500 });
        }

        const res = await prismaClient.$executeRaw`
            update "Launchpad" set "totalUniqueUsers" = "totalUniqueUsers" + 1
        `;
        console.debug(`result of updating totalUniqueUsers col. in launchpad table:\n${res}`);

        return NextResponse.json({ message: `valid OTP ${OTP}` }, { status: 200 });
    } catch (error) {
        console.error('error verifying email: ', error);
        return NextResponse.json({ error: 'error verifying email' }, { status: 500 });
    }
}

// export async function GET(req: Request) {
//     try {
//         const res = await prismaClient.$executeRaw`
//             update "Launchpad" set "totalUniqueUsers" = "totalUniqueUsers" + 1
//         `;
        
//         console.debug(`result of updating launchpad table:\n${res}`);
//         return NextResponse.json({ success: true }, { status: 200 });
//     } catch (err) {
//         console.error('error verifying email: ', err);
//         return NextResponse.json({ success: false }, { status: 500 });
//     }
// }