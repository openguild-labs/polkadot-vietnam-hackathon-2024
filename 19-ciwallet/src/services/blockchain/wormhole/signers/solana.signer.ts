import { Network as WormholeNetwork } from "@wormhole-foundation/sdk"
import {
    SolanaChains,
    SolanaSendSigner,
} from "@wormhole-foundation/sdk-solana"
import { SignerParams } from "../base.wormhole"
import { solanaClient as _solanaClient } from "../../rpcs"
import { Connection, Keypair } from "@solana/web3.js"
import { parseWormholeNetwork } from "../../common"
import bs58 from "bs58"

export const solanaSigner = ({
    privateKey,
    network,
    chain,
    debug,
}: SignerParams<WormholeNetwork, SolanaChains>) => {
    const keypair = Keypair.fromSecretKey(
        bs58.decode(privateKey)
    )
    let solanaClient: Connection
    switch (network) {
    case "Testnet": {
        solanaClient = _solanaClient(parseWormholeNetwork(network))
        break
    }
    case "Mainnet": {
        solanaClient = _solanaClient(parseWormholeNetwork(network))
        break
    }
    default: {
        throw new Error("Devnet not supported")
    }
    }
    return new SolanaSendSigner(solanaClient, chain, keypair, debug ?? false, {})
}
