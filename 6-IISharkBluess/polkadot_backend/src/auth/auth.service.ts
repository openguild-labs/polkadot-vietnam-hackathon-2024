import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WalletName } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async findOrCreateWallet(
    user_id: string,
    name: string,
    address: string,
    walletName: WalletName,
  ) {
    return this.prisma.walletAddress.upsert({
      create: {
        userId: user_id,
        name: name,
        address: address,
        walletName: walletName,
      },
      update: {
        address: address,
      },
      where: {
        userId: user_id,
        walletName: walletName
      }
    });
  }

  async connectWallet(
    name: string,
    address: string,
    balance: number,
    walletName: WalletName,
  ) {
    const user = await this.userService.createAndUpdateAccount(address, balance);
    const myWallets = await this.findOrCreateWallet(
      user.id,
      name,
      address,
      walletName,
    );

    const payload = {
      userId: user.id,
      walletId: myWallets.id,
      name: name,
      address: address,
    };
    const access_token = this.jwtService.sign(payload);

    return access_token;
  }

  async disconnectWallet(walletId: string) {
    return await this.prisma.walletAddress.update({
      where: {
        id: walletId,
      },
      data: {
        is_deleted: true,
      },
    });
  }
}
