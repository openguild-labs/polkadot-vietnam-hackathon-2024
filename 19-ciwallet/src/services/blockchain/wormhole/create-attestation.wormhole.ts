import { sleep } from "@/utils"
import { getWormhole } from "./base.wormhole"
import {
    Chain,
    Network,
    SignAndSendSigner,
    VAA,
    WormholeMessageId,
    signSendWait,
    toNative,
} from "@wormhole-foundation/sdk"
import { nativeTokenKey } from "@/config"

export interface CreateAttestationParams<
  N extends Network,
  ChainName extends Chain
> {
  network: N;
  chainName: ChainName;
  tokenAddress: string;
  signer: SignAndSendSigner<N, ChainName>;
}

interface CreateAttestationResult {
  vaa: VAA<"TokenBridge:AttestMeta"> | null;
  txHash: string;
}

export const createAttestation = async <
  N extends Network,
  ChainName extends Chain
>({
    network,
    chainName,
    tokenAddress,
    signer,
}: CreateAttestationParams<N, ChainName>): Promise<CreateAttestationResult> => {
    const wormhole = await getWormhole(network)
    const chain = wormhole.getChain(chainName)

    const tokenBridge = await chain.getTokenBridge()
    
    if (tokenAddress === nativeTokenKey) {
        tokenAddress = (
            await tokenBridge.getWrappedNative()
        ).toString()
    }
    const txGenerator = tokenBridge.createAttestation(
        toNative(chainName, tokenAddress),
        toNative(chainName, signer.address())
    )

    const transactionIds = await signSendWait(chain, txGenerator, signer)

    const { txid } = transactionIds.at(-1)!

    let wormholeMessage: WormholeMessageId | undefined = undefined
    for (let repeat = 0; repeat < 30; repeat++) {
        console.log(`Checking for wormhole message ${txid} - ${repeat}`)
        const [_wormholeMessage] = await chain.parseTransaction(txid)
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
        "TokenBridge:AttestMeta",
        60_000
    )
    return {
        vaa,
        txHash: txid,
    }
}
