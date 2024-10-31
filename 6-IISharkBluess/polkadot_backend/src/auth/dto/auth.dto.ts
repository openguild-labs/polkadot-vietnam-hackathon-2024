import { ApiProperty } from '@nestjs/swagger';
import { WalletName } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class connectWalletDto {
  @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: WalletName })
  @IsNotEmpty()
  wallet_name: string;

  @ApiProperty()
  balance: number;
}


