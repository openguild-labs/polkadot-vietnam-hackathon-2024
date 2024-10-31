import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PoolController } from './pool.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [PoolController],
  providers: [PoolService, PrismaService, UserService]
})
export class PoolModule {}
