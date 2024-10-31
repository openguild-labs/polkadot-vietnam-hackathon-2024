import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPairDto } from './dto/pair.dto';

@Injectable()
export class PairService {
  constructor(private prisma: PrismaService) {}

  async createPairToken(data: createPairDto) {
    const {
      lend_token_symbol,
      collateral_token_symbol,
      lend_token,
      collateral_token,
      lend_icon,
      collateral_icon,
      lend_amount,
      lend_token_name,
      collateral_token_name
    } = data;
    return this.prisma.pairToken.create({
      data: {
       lend_token_symbol,
       collateral_token_symbol,
       lend_token,
       collateral_token,
       lend_icon,
       collateral_icon,
       lend_amount,
       lend_token_name,
       collateral_token_name
      },
    });
  }

  async getAllPair() {
    return (await this.prisma.pairToken.findMany()).sort();
  }

  async getPair (paidId: string) {
    return await this.prisma.pairToken.findUnique({
        where: {
            id: paidId
        }
    });
  }

  async updatePairToken(pairId: string, data: createPairDto) {
    const {
        lend_token_symbol,
        collateral_token_symbol,
        lend_token,
        collateral_token,
        lend_amount,
      } = data;
    return await this.prisma.pairToken.update({
        data: {
          lend_token_symbol,
          collateral_token_symbol,
          lend_token,
          collateral_token,
          lend_amount
        },
        where: {
          id: pairId,
        },
      });
  }

  async deletePair (paidId: string) {
    return await this.prisma.pairToken.delete({
        where: {
            id: paidId
        }
    })
  }
}
