import { PrismaClient } from "@prisma/client";

/**
 * singleton instance of PrismaClient
 */
const prismaClient = new PrismaClient();

export {
    prismaClient,
};