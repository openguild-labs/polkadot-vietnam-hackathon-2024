import { AptosChains, AptosSigner } from "@wormhole-foundation/sdk-aptos"
import { Network as WormholeNetwork } from "@wormhole-foundation/sdk"
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"
import { SignerParams } from "../base.wormhole"
import { AptosAccount, AptosClient } from "aptos"
import { Network } from "@/config"
import { parseWormholeNetwork } from "../../common"

export const aptosNodes: Record<Network, string> = {
    [Network.Mainnet]: "https://api.mainnet.aptoslabs.com/v1",
    [Network.Testnet]: "https://api.testnet.aptoslabs.com/v1",
}

export const aptosSigner = ({
    privateKey,
    network,
    chain,
    address,
    debug,
}: SignerParams<WormholeNetwork, AptosChains>) => {
    const account = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(privateKey),
        address,
    })

    const _account = AptosAccount.fromAptosAccountObject({
        privateKeyHex: privateKey,
        publicKeyHex: account.publicKey.toString(),
        address: account.accountAddress.toString(),
    })
    const aptosClient = new AptosClient(
        aptosNodes[parseWormholeNetwork(network)]
    )
    return new AptosSigner(chain, _account, aptosClient, debug)
}
