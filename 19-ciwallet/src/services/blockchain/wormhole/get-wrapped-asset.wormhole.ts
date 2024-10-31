import { TokenAddress } from "@wormhole-foundation/sdk-definitions"
import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { toWormholeUniversal } from "./to.wormhole"

export interface GetWrappedAssetParams<
  N extends Network,
  SourceChainName extends Chain,
  ForeignChainName extends Chain
> {
  network: N;
  sourceTokenAddress: string;
  sourceChainName: SourceChainName;
  foreignChainName: ForeignChainName;
}

export const getWrappedAsset = async <
  N extends Network,
  SourceChainName extends Chain,
  ForeignChainName extends Chain
>({
    network,
    sourceTokenAddress,
    sourceChainName,
    foreignChainName,
}: GetWrappedAssetParams<N, SourceChainName, ForeignChainName>): Promise<
  TokenAddress<ForeignChainName>
> => {
    const wormhole = await getWormhole(network)
    const sourceChain = wormhole.getChain(sourceChainName)
    const sourceTokenBridge = await sourceChain.getTokenBridge()
    const foreignChain = wormhole.getChain(foreignChainName)
    const foreignTokenBridge = await foreignChain.getTokenBridge()

    if (sourceTokenAddress === "native") {
        sourceTokenAddress = (
            await sourceTokenBridge.getWrappedNative()
        ).toString()
    }
    const universalAddress = toWormholeUniversal(
        sourceChainName,
        sourceTokenAddress
    )

    return await foreignTokenBridge.getWrappedAsset({
        address: universalAddress,
        chain: sourceChainName,
    })
}
