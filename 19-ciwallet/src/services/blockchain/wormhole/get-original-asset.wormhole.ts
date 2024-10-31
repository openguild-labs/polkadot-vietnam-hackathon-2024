import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { toWormholeUniversal } from "./to.wormhole"
import { TokenId } from "@wormhole-foundation/sdk"

export interface GetOriginalAssetParams<
  N extends Network,
  SourceChainName extends Chain,
> {
  network: N;
  tokenAddress: string;
  chainName: SourceChainName;
}

export const getOriginalAsset = async <
  N extends Network,
  ChainName extends Chain,
>({
    network,
    tokenAddress,
    chainName,
}: GetOriginalAssetParams<N, ChainName>): Promise<TokenId<Chain>> => {
    const wormhole = await getWormhole(network)
    const chain = wormhole.getChain(chainName)
    const tokenBridge = await chain.getTokenBridge()
    return await tokenBridge.getOriginalAsset(toWormholeUniversal(chainName, tokenAddress))
}
