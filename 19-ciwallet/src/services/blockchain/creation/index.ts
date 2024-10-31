import { ChainAccount, Platform, chainKeyToPlatform } from "../common"
import { createAlgorandAccount, importAlgorandAccount } from "./algorand.creation"
import { createAptosAccount, importAptosAccount } from "./aptos.creation"
import { createEvmAccount, importEvmAccount } from "./evm.creation"
import { createNearAccount, importNearAccount } from "./near.creation"
import { createPolkadotAccount, importPolkadotAccount } from "./polkadot.creation"
import { createSolanaAccount, importSolanaAccount } from "./solana.creation"
import { createSuiAccount, importSuiAccount } from "./sui.creation"
import { CreateAccountParams, ImportAccountParams } from "./types.creation"

export const createAccount = async (params: CreateAccountParams): Promise<ChainAccount> => {
    if (params.mnemonic === "")
        return {
            address: "",
            privateKey: "",
            publicKey: "",
        }

    const platform = chainKeyToPlatform(params.chainKey)
    switch (platform) {
    case Platform.Evm:
        return createEvmAccount(params)
    case Platform.Aptos:
        return createAptosAccount(params)
    case Platform.Solana:
        return createSolanaAccount(params)
    case Platform.Algorand:
        return createAlgorandAccount(params)
    case Platform.Sui:
        return createSuiAccount(params)
    case Platform.Polkadot:
        return await createPolkadotAccount(params)
    case Platform.Near:
        return await createNearAccount(params)
    }
}

export const importAccount = ({
    privateKey,
    chainKey,
    accountAddress,
}: ImportAccountParams): ChainAccount => {
    if (privateKey === "")
        return {
            address: "",
            privateKey: "",
            publicKey: "",
        }

    const platform = chainKeyToPlatform(chainKey)
    switch (platform) {
    case Platform.Evm:
        return importEvmAccount({
            privateKey,
        })
    case Platform.Aptos:
        return importAptosAccount({
            privateKey,
            accountAddress
        })
    case Platform.Solana:
        return importSolanaAccount({
            privateKey
        })
    case Platform.Algorand:
        return importAlgorandAccount({
            privateKey
        })
    case Platform.Sui:
        return importSuiAccount({
            privateKey
        })
    case Platform.Polkadot:
        return importPolkadotAccount({
            privateKey
        })
    case Platform.Near:
        return importNearAccount({
            privateKey
        })
    }
}
// Compare this snippet from src/services/blockchain/creation/sui.creation.ts:

