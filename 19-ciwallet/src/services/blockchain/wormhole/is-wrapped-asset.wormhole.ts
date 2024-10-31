import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { toWormholeUniversal } from "./to.wormhole"

export interface IsWrappedAssetParams<
  N extends Network,
  SourceChainName extends Chain,
> {
  network: N;
  tokenAddress: string;
  chainName: SourceChainName;
}

export const isWrappedAsset = async <
  N extends Network,
  ChainName extends Chain,
>({
    network,
    tokenAddress,
    chainName,
}: IsWrappedAssetParams<N, ChainName>): Promise<boolean> => {
    const wormhole = await getWormhole(network)
    const chain = wormhole.getChain(chainName)
    const tokenBridge = await chain.getTokenBridge()
    return await tokenBridge.isWrappedAsset(toWormholeUniversal(chainName, tokenAddress))
}
