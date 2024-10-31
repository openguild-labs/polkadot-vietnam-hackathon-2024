
import {
    SignAndSendSigner,
    VAA,
} from "@wormhole-foundation/sdk-definitions"
import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { WormholeMessageId, signSendWait } from "@wormhole-foundation/sdk"
import { sleep } from "@/utils"
import { toWormholeUniversal } from "./to.wormhole"

export interface TransferParams<
    N extends Network,
    SourceChainName extends Chain,
    TargetChainName extends Chain
> {
    network: N
    transferAmount: bigint
    recipientAddress: string
    tokenAddress: string
    sourceChainName: SourceChainName
    targetChainName: TargetChainName
    signer: SignAndSendSigner<N, SourceChainName>
}

interface TransferResult {
    vaa: VAA<"TokenBridge:Transfer"> | null,
    txHash: string
}

export const transfer = async <
    N extends Network,
    SourceChainName extends Chain,
    TargetChainName extends Chain
>({
    network,
    transferAmount,
    recipientAddress,
    tokenAddress,
    sourceChainName,
    targetChainName,
    signer,
}: TransferParams<N, SourceChainName, TargetChainName>) : Promise<TransferResult> => {
    const wormhole = await getWormhole(network)
    const sourceChain = wormhole.getChain(sourceChainName)
    const sourceTokenBridge = await sourceChain.getTokenBridge()
    
    const txGenerator = sourceTokenBridge.transfer(
        toWormholeUniversal(sourceChainName, signer.address()),
        {
            chain: targetChainName,
            address: toWormholeUniversal(targetChainName, recipientAddress),
        },
        tokenAddress !== "native" ? toWormholeUniversal(sourceChainName, tokenAddress) : "native",
        transferAmount
    )

    const transactionIds = await signSendWait(sourceChain, txGenerator, signer)

    const { txid } = transactionIds.at(-1)!

    let wormholeMessage: WormholeMessageId | undefined = undefined
    for (let repeat = 0; repeat < 30; repeat++) {
        console.log(`Checking for wormhole message ${txid} - ${repeat}`)
        const [_wormholeMessage] = await sourceChain.parseTransaction(txid)
        if (_wormholeMessage) {
            wormholeMessage = _wormholeMessage
            break
        } else {
            await sleep(1000)
        }
    }
    if (!wormholeMessage) throw new Error("Wormhole message not found")

    const vaa = await wormhole.getVaa(

        wormholeMessage,
        "TokenBridge:Transfer",
        60_000
    )

    return { vaa, txHash: txid }
}
