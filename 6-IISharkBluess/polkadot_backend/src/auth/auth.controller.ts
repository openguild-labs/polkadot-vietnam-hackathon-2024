import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { WalletName } from '@prisma/client';
import { ResponseMessage } from 'src/utils/ResMessage.utils';
import { connectWalletDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('connect-wallet')
    async connectWallet(@Body() body: connectWalletDto) {
      return new ResponseMessage(
        200,
        'Wallet connected',
        await this.authService.connectWallet(
          body.name,
          body.address,
          body.balance,
          body.wallet_name as WalletName,
        ),
      );
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('disconnect-wallet/:walletId')
    async disconnectWallet(
      @Req() _: AuthRequest,
      @Param('walletId') walletId: string,
    ) {
      return new ResponseMessage(
        200,
        'Wallet disconnected',
        await this.authService.disconnectWallet(walletId),
      );
    }
}
