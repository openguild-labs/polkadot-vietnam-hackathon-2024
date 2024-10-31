import { Network as WormholeNetwork } from "@wormhole-foundation/sdk"
import { SignerParams } from "../base.wormhole"
import { Network } from "@/config"
import { AlgorandSigner, AlgorandChains } from "@wormhole-foundation/sdk-algorand"
import { Algodv2, secretKeyToMnemonic } from "algosdk"
import { algorandAlgodClient } from "../../rpcs"
import { parseWormholeNetwork } from "../../common"

export const aptosNodes: Record<Network, string> = {
    [Network.Mainnet]: "https://api.mainnet.aptoslabs.com/v1",
    [Network.Testnet]: "https://api.testnet.aptoslabs.com/v1",
}

export const algorandSigner = ({
    chain,
    privateKey,
    network,
    debug,
}: SignerParams<WormholeNetwork, AlgorandChains>) => {
    const mnemonic = secretKeyToMnemonic(Buffer.from(privateKey, "base64"))
    let _algorandClient: Algodv2
    switch (network) {
    case "Testnet": {
        _algorandClient = algorandAlgodClient(parseWormholeNetwork(network))
        break
    }
    case "Mainnet": {
        _algorandClient = algorandAlgodClient(parseWormholeNetwork(network))
        break
    }
    default: {
        throw new Error("Devnet not supported")
    }
    }
    return new AlgorandSigner(
        chain,
    _algorandClient as never,
    mnemonic,
    debug
    )
}
