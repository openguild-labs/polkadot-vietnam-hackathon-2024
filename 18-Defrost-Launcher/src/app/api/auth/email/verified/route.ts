import { NextResponse } from 'next/server';
import { prismaClient } from '@/*';
import Email from 'next-auth/providers/email';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function POST(req: Request) {
    const { email: inputEmail, address: inputAddress } = await req.json();

    if (!inputEmail || !inputAddress) {
        return NextResponse.json({ error: 'missing user email or address' }, { status: 400 });
    }

    try {
        // Verify the token against your database
        const user = await prismaClient.user.findUnique(
            {
                where: {
                    address: inputAddress,
                    email: inputEmail,
                },
                select: {
                    emailVerified: true,
                }
            });

        const isVerified = !!user && user?.emailVerified;
        return NextResponse.json({ verified: isVerified.toString() }, { status: 200 });
    } catch (error) {
        console.error('Error verifying email:', error);
        let errMsg = "";
        if (error instanceof PrismaClientKnownRequestError) {
            const prismaErr = (error as PrismaClientKnownRequestError)
            switch (prismaErr.code) {
                case "p2002":
                    errMsg = `A user with address ${inputAddress}`;
                    break;
            }
        }
        return NextResponse.json({ error: errMsg }, { status: 500 });
    }
}