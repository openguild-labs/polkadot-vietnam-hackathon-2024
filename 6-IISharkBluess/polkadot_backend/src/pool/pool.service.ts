import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPoolDto } from './dto/pool.dto';
import { PoolStatus } from '@prisma/client';

@Injectable()
export class PoolService {
  constructor(private prisma: PrismaService) {}

  async createPool(data: createPoolDto) {
    const {
      pairId,
      name,
      creator,
      collateral_amount,
      profit,
      expire,
    } = data;

    return await this.prisma.pool.create({
      data: {
        pairId: pairId,
        name,
        creator,
        collateral_amount,
        profit,
        expire,
      },
    });
  }

  async createUserPool(user_id: string, pool_id: string) {
    return this.prisma.user_Pool.create({
      data: {
        userId: user_id,
        poolId: pool_id,
      },
    });
  }

  async getPool(pool_id: string) {
    return await this.prisma.pool.findUnique({
      where: {
        id: pool_id
      }
    })
  }

  async getAllPool() {
    return await this.prisma.pool.findMany();
  }

  async updatePool(pool_id: string, profit: number) {
    return this.prisma.pool.update({
      data: {
        profit,
      },
      where: {
        id: pool_id,
      },
    });
  }

  async cancelPool(pool_id: string) {
    return this.prisma.pool.update({
      where: {
        id: pool_id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
