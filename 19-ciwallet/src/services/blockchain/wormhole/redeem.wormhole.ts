
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import {
    SignAndSendSigner,
    VAA,
    toNative,
} from "@wormhole-foundation/sdk-definitions"
import { getWormhole } from "./base.wormhole"
import { signSendWait } from "@wormhole-foundation/sdk"

export interface RedeemParams<
    N extends Network,
    RedeemChainName extends Chain,
    SenderChainName extends Chain
> {
    network: N,
    vaa: VAA<"TokenBridge:Transfer">
    senderChainName: SenderChainName
    redeemChainName: RedeemChainName
    redeemAddress: string
    signer: SignAndSendSigner<N, RedeemChainName>
}

export const redeem = async <
    N extends Network,
    RedeemChainName extends Chain,
    SenderChainName extends Chain
>({
    network,
    vaa,
    redeemChainName,
    signer,
    redeemAddress
}: RedeemParams<N, RedeemChainName, SenderChainName>) => {
    const wormhole = await getWormhole(network)
    const redeemChain = wormhole.getChain(redeemChainName)
 
    const claimTokenBridge = await redeemChain.getTokenBridge() 
    
    const txGenerator = claimTokenBridge.redeem(
        toNative(redeemChainName, redeemAddress),
        vaa
    )

    const transactionIds = await signSendWait(redeemChain, txGenerator, signer)
    const { txid } = transactionIds.at(0)!
    return txid
}
