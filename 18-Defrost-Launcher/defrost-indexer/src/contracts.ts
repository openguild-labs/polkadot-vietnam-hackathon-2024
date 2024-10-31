import { Store } from '@subsquid/typeorm-store'
import { Contract } from './model'

export const astarDegensAddress = '0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a'.toLowerCase();
export const astarCatsAddress = '0x8b5d62f396Ca3C6cF19803234685e693733f9779'.toLowerCase();

export const contractMapping: Map<string, Contract> = new Map()

contractMapping.set(astarDegensAddress, new Contract({
    id: astarDegensAddress,
    name: 'AstarDegens',
    symbol: 'DEGEN',
    totalSupply: 10000n,
    mintedTokens: []
}))

contractMapping.set(astarCatsAddress, new Contract({
    id: astarCatsAddress,
    name: 'AstarCats',
    symbol: 'CAT',
    totalSupply: 7777n,
    mintedTokens: []
}))