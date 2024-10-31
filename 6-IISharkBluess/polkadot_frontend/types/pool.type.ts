export type Pool = {
    id: string,
    pairId: string,
    name: string,
    creator: string,
    borrower: string,
    collateral_amount: number,
    profit: number,
    expire: number,
    isDeleted: boolean,
    pool_status: PoolSatus,
    createdAt?: string,
    updatedAt?: string
}

export enum PoolSatus {PENDING, STARTING, ENDING}