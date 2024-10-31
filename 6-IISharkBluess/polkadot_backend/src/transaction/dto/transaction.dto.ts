import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class createTransactionDto {
    @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
    @IsNotEmpty()
    hash: string

    @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
    @IsNotEmpty()
    sender: string

    @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
    @IsNotEmpty()
    receiver: string

    @ApiProperty({ example: '0x2PKvwCaa78q2oWAU4FuoEVhrVFDuds5LthNbqwSUosMz' })
    @IsNotEmpty()
    token: string

    @ApiProperty()
    symbol: string

    @ApiProperty()
    @IsNotEmpty()
    amount: number

    @ApiProperty()
    to_smart_contract: boolean
}