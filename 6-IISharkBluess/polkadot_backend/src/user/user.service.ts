import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async createAndUpdateAccount (wallet_address: string, balance: number) {
        return this.prisma.user.upsert({
            create: {
                wallet_address,
                balance,
            },
            update: {
                balance,
            },
            where: {
                wallet_address
            }
        })
    }

    async getAccount (userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    }

    async deleteAccount (userId: string) {
        return this.prisma.user.delete({
            where: {
                id: userId
            }
        })
    }

    async getAllAccounts () {
        return this.prisma.user.findMany();
    }

    async getAccountByAddress (address: string) {
        return this.prisma.user.delete({
            where: {
                wallet_address: address
            }
        })
    }
}
