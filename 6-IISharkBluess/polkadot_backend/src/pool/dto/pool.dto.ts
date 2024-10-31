import { ApiProperty } from "@nestjs/swagger";

export class createPoolDto {
    @ApiProperty()
    pairId: string
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    creator: string;

    @ApiProperty()
    collateral_amount: number;

    @ApiProperty()
    profit: number;

    @ApiProperty()
    expire: number;
}


export enum PoolStatus {PENDING, STARTING, ENDING}