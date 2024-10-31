import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class createAccountDto {
    @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
    @IsNotEmpty()
    wallet_address: string

    @ApiProperty()
    @IsNotEmpty()
    balance: number
}

