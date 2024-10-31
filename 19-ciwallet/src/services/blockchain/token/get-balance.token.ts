import { Network, blockchainConfig, nativeTokenKey } from "@/config"
import { Contract, JsonRpcProvider } from "ethers"
import { algorandAlgodClient, aptosClient, evmHttpRpcUrl, nearClient, solanaClient, SUI_COIN_TYPE, suiClient } from "../rpcs"
import { erc20Abi } from "../abis"
import { computeDenomination } from "@/utils"
import { PublicKey } from "@solana/web3.js"
import { Platform, chainKeyToPlatform } from "../common"

export interface GetBalanceParams {
  chainKey: string;
  tokenAddress: string;
  network?: Network;
  accountAddress: string;
}

export const _getEvmBalance = async ({
    chainKey,
    tokenAddress,
    network,
    accountAddress,
}: GetBalanceParams): Promise<number> => {
    if (!tokenAddress) throw new Error("Cannot find balance without token address")
    network = network || Network.Testnet

    const rpcUrl = evmHttpRpcUrl(chainKey, network)
    const provider = new JsonRpcProvider(rpcUrl)
    if (tokenAddress === nativeTokenKey) {
        const { decimals } = blockchainConfig().chains[chainKey].tokens[nativeTokenKey][network]
        if (!decimals) throw new Error("decimals must not undefined")
        const balance = await provider.getBalance(accountAddress)
        return computeDenomination(balance, decimals)
    } else {
        const contract = new Contract(tokenAddress, erc20Abi, provider)
        const [balance, decimals] = await Promise.all([
            await contract.getFunction("balanceOf").staticCall(accountAddress),
            await contract.getFunction("decimals").staticCall(),
        ])
        return computeDenomination(balance, Number(decimals))
    }
}

export const _getAptosBalance = async ({
    chainKey,
    tokenAddress,
    network,
    accountAddress,
}: GetBalanceParams): Promise<number> => {
    if (!tokenAddress) throw new Error("Cannot find balance without token address")
    network = network || Network.Testnet
    
    const { decimals } = blockchainConfig().chains[chainKey].tokens[nativeTokenKey][network]
    if (!decimals) throw new Error("decimals must not undefined")
    
    if (tokenAddress === "native") { 
        const balance = await aptosClient(network).getAccountAPTAmount({
            accountAddress
        })
        return computeDenomination(balance, decimals)
    } else {
        const { decimals } = await aptosClient(network).getFungibleAssetMetadataByAssetType({
            assetType: tokenAddress as `${string}::${string}::${string}`
        })
        const balance = await aptosClient(network).getAccountCoinAmount({
            coinType: tokenAddress as `${string}::${string}::${string}`,
            accountAddress
        })
        return computeDenomination(balance, decimals)
    }
}

export const _getSolanaBalance = async ({
    chainKey,
    tokenAddress,
    network,
    accountAddress,
}: GetBalanceParams): Promise<number> => {
    if (!tokenAddress) throw new Error("Cannot find balance without token address")
    network = network || Network.Testnet
    
    const { decimals } = blockchainConfig().chains[chainKey].tokens[nativeTokenKey][network]
    if (!decimals) throw new Error("decimals must not undefined")

    if (tokenAddress === nativeTokenKey) {
        const balance = await solanaClient(network).getBalance(new PublicKey(accountAddress))
        return computeDenomination(balance, decimals)
    } else {
        const result = await solanaClient(network).getParsedTokenAccountsByOwner(
            new PublicKey(accountAddress),
            {
                mint: new PublicKey(tokenAddress),
            }
        )
        return result.value[0].account.data.parsed.info.tokenAmount.uiAmount
    }
}

export const _getAlgorandBalance = async ({
    chainKey,
    tokenAddress,
    network,
    accountAddress,
}: GetBalanceParams): Promise<number> => {
    if (!tokenAddress) throw new Error("Cannot find balance without token address")
    network = network || Network.Testnet
    
    const { decimals } = blockchainConfig().chains[chainKey].tokens[nativeTokenKey][network]
    if (!decimals) throw new Error("decimals must not undefined")
    
    const accountInfo = await algorandAlgodClient(network).accountInformation(accountAddress).do()
    if (tokenAddress === nativeTokenKey) {
        return computeDenomination(accountInfo.amount, decimals)
    }

    const assets = accountInfo.assets
    const assetId = BigInt(tokenAddress)
    if (!assets) return 0
    const foundAsset = assets.find((asset) => asset.assetId === assetId)
    if (!foundAsset) return 0
    return computeDenomination(foundAsset.amount, decimals)
}

export const _getSuiBalance = async ({
    chainKey,
    tokenAddress,
    network,
    accountAddress,
}: GetBalanceParams): Promise<number> => {
    if (!tokenAddress) throw new Error("Cannot find balance without token address")
    network = network || Network.Testnet

    const { decimals } = blockchainConfig().chains[chainKey].tokens[nativeTokenKey][network]
    if (!decimals) throw new Error("decimals must not undefined")

    if (tokenAddress === nativeTokenKey) { 
        const balance = await suiClient(network).getBalance({
            owner: accountAddress,
            coinType: SUI_COIN_TYPE
        })
        return computeDenomination(BigInt(balance.totalBalance), decimals)
    } else {
        const metadata = await suiClient(network).getCoinMetadata({
            coinType: tokenAddress,
        })
        if (!metadata) throw new Error("Sui coin metadata not found")
        const balance = await suiClient(network).getBalance({
            coinType: tokenAddress,
            owner: accountAddress
        })
        return computeDenomination(BigInt(balance.totalBalance), metadata.decimals)
    }
}

export const _getNearBalance = async ({
    chainKey,
    tokenAddress,
    network,
    accountAddress,
}: GetBalanceParams): Promise<number> => {
    if (!tokenAddress) throw new Error("Cannot find balance without token address")
    network = network || Network.Testnet

    const { decimals } = blockchainConfig().chains[chainKey].tokens[nativeTokenKey][network]
    if (!decimals) throw new Error("decimals must not undefined")

    const client = await nearClient(network)
    const account = await client.account(accountAddress)
    
    if (tokenAddress === nativeTokenKey) { 
        const balance = await account.getAccountBalance()
        return computeDenomination(BigInt(balance.total), decimals)
    } else {
        // const metadata = await suiClient(network).getCoinMetadata({
        //     coinType: tokenAddress,
        // })
        // if (!metadata) throw new Error("Sui coin metadata not found")
        // const balance = await suiClient(network).getBalance({
        //     coinType: tokenAddress,
        //     owner: accountAddress
        // })
        // return computeDenomination(BigInt(balance.totalBalance), metadata.decimals)
        return 0
    }
}

export const _getBalance = (params: GetBalanceParams) => {
    const platform = chainKeyToPlatform(params.chainKey)
    switch (platform) {
    case Platform.Evm: return _getEvmBalance(params)
    case Platform.Aptos: return _getAptosBalance(params)
    case Platform.Solana: return _getSolanaBalance(params)
    case Platform.Algorand: return _getAlgorandBalance(params)
    case Platform.Sui: return _getSuiBalance(params)
    case Platform.Near: return _getNearBalance(params)
    case Platform.Polkadot: throw new Error("Polkadot balance not supported")
    }
}