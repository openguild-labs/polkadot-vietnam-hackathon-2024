export * from "./aptos.signer"
export * from "./solana.signer"
export * from "./evm.signer"
import {
    Chain,
    Network as WormholeNetwork,
    chainToPlatform,
} from "@wormhole-foundation/sdk"
import { SignerParams } from "../base.wormhole"
import { evmSigner } from "./evm.signer"
import { EvmChains } from "@wormhole-foundation/sdk-evm"
import { AptosChains } from "@wormhole-foundation/sdk-aptos"
import { aptosSigner } from "./aptos.signer"
import { solanaSigner } from "./solana.signer"
import { SolanaChains } from "@wormhole-foundation/sdk-solana"
import { AlgorandChains } from "@wormhole-foundation/sdk-algorand"
import { algorandSigner } from "./algorand.signer"

export const signer = (params: SignerParams<WormholeNetwork, Chain>) => {
    const platform = chainToPlatform(params.chain)
    switch (platform) {
    case "Evm":
        return evmSigner(params as SignerParams<WormholeNetwork, EvmChains>)
    case "Aptos":
        return aptosSigner(params as SignerParams<WormholeNetwork, AptosChains>)
    case "Solana":
        return solanaSigner(
        params as SignerParams<WormholeNetwork, SolanaChains>
        )
    case "Algorand": 
        return algorandSigner(params as SignerParams<WormholeNetwork, AlgorandChains>)
    }}
