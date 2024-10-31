import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { toWormholeUniversal } from "./to.wormhole"

export interface GetDecimalsParams<
  N extends Network,
  SourceChainName extends Chain,
> {
  network: N;
  tokenAddress: string;
  chainName: SourceChainName;
}

export const getDecimals = async <
  N extends Network,
  ChainName extends Chain,
>({
    network,
    tokenAddress,
    chainName,
}: GetDecimalsParams<N, ChainName>): Promise<number> => {
    const wormhole = await getWormhole(network)
    console.log(tokenAddress, chainName)
    return await wormhole.getDecimals(chainName, toWormholeUniversal(chainName, tokenAddress))
}
