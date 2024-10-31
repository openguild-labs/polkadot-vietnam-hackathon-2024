import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class createPairDto {
    @ApiProperty({ example: 'SOL' })
    @IsNotEmpty()
    lend_token_symbol: string

    @ApiProperty({ example: 'ETH' })
    @IsNotEmpty()
    collateral_token_symbol: string

    @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
    @IsNotEmpty()
    lend_token: string

    @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
    @IsNotEmpty()
    collateral_token: string

    @ApiProperty({example: 'https://'})
    lend_icon: string

    @ApiProperty({example: 'https://'})
    collateral_icon: string
    
    @ApiProperty({ example: '10' })
    @IsNotEmpty()
    lend_amount: number

    @ApiProperty({example: 'eth'})
    lend_token_name: string
   
    @ApiProperty({example: 'sol'})
    collateral_token_name: string
}