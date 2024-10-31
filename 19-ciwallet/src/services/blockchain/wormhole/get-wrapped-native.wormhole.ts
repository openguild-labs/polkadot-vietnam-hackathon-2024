import { TokenAddress } from "@wormhole-foundation/sdk-definitions"
import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"

export interface GetWrappedNativeParams<
  N extends Network,
  ChainName extends Chain
> {
  network: N;
  chainName: ChainName;
}

export const getWrappedNative = async <
  N extends Network,
  ChainName extends Chain
>({
    network,
    chainName,
}: GetWrappedNativeParams<N, ChainName>): Promise<TokenAddress<ChainName>> => {
    const wormhole = await getWormhole(network)
    const chain = wormhole.getChain(chainName)
    const tokenBridge = await chain.getTokenBridge()
    return await tokenBridge.getWrappedNative()
}
