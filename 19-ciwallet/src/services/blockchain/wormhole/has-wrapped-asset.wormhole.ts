import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { UniversalAddress } from "@wormhole-foundation/sdk"
import { toWormholeUniversal } from "./to.wormhole"


export interface HasWrappedAssetParams<
  N extends Network,
  SourceChainName extends Chain,
  ForeignChainName extends Chain
> {
  network: N;
  sourceTokenAddress: string;
  sourceChainName: SourceChainName;
  foreignChainName: ForeignChainName;
}

export const hasWrappedAsset = async <
  N extends Network,
  SourceChainName extends Chain,
  ForeignChainName extends Chain
>({
    network,
    sourceTokenAddress,
    sourceChainName,
    foreignChainName,
}: HasWrappedAssetParams<N, SourceChainName, ForeignChainName>): Promise<boolean
> => {
    const wormhole = await getWormhole(network)
    const sourceChain = wormhole.getChain(sourceChainName)
    const sourceTokenBridge = await sourceChain.getTokenBridge()
    const foreignChain = wormhole.getChain(foreignChainName)
    const foreignTokenBridge = await foreignChain.getTokenBridge()

    let universalAddress: UniversalAddress
    
    if (sourceTokenAddress === "native") {
        const native = await sourceTokenBridge.getWrappedNative()
        universalAddress = native.toUniversalAddress()
    } else {
        universalAddress = toWormholeUniversal(sourceChainName, sourceTokenAddress)
    }

    return await foreignTokenBridge.hasWrappedAsset({
        address: universalAddress,
        chain: sourceChainName,
    })
}
