import { Module } from '@nestjs/common';
import { PairService } from './pair.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PairController } from './pair.controller';

@Module({
  controllers: [PairController],
  providers: [PairService, PrismaService]
})
export class PairModule {}
