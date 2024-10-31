import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PoolController } from './pool/pool.controller';
import { PoolModule } from './pool/pool.module';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionModule } from './transaction/transaction.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { PoolService } from './pool/pool.service';
import { TransactionService } from './transaction/transaction.service';
import { PairController } from './pair/pair.controller';
import { PairModule } from './pair/pair.module';
import { PairService } from './pair/pair.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PoolModule,
    TransactionModule,
    AuthModule,
    PairModule,
    PairModule,
  ],
  controllers: [
    AppController,
    UserController,
    PoolController,
    TransactionController,
    AuthController,
    PairController,
  ],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    JwtService,
    UserService,
    PoolService,
    TransactionService,
    PairService,
  ],
})
export class AppModule {}
