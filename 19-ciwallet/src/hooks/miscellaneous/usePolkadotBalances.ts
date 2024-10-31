import useSWR, { SWRResponse } from "swr"
import "@polkadot/api-augment"
import { useAppSelector } from "@/redux"
import {
    nativeTokenKey,
    PolkadotChainKey,
    SupportedChainKey,
} from "@/config"
import {
    polkadotRelayChainClient,
    polkadotUniqueNetworkSdkClient,
    polkadotMoonbeamProvider,
    erc20Abi,
} from "@/services"
import { computeDenomination } from "@/utils"
import { Contract } from "ethers"
import { addressToEvm } from "@polkadot/util-crypto"
import { u8aToHex } from "@polkadot/util"
import { usePolkadotTokenDetailsModalDiscloresure } from "../modals"

export interface UsePolkadotBalancesParams {
  address: string;
  tokenKey: string;
  forceReloadWhenOpenModal?: boolean;
}

export type UsePolkadotRelayChainBalanceParams = UsePolkadotBalancesParams;
export type UsePolkadotUniqueNetworkBalanceParams = UsePolkadotBalancesParams;
export type UsePolkadotMoonbeamBalanceParams = UsePolkadotBalancesParams;

// Represents the balances of the different networks
export type PolkadotBalances = Record<PolkadotChainKey, number>;

export interface UsePolkadotBalancesReturn {
  balances: PolkadotBalances;
  loaded: boolean;
  total: number;
}

export const usePolkadotRelayChainBalance = ({
    address,
    tokenKey,
    forceReloadWhenOpenModal,
}: UsePolkadotRelayChainBalanceParams): SWRResponse<number, unknown> => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const { isOpen } = usePolkadotTokenDetailsModalDiscloresure()
    // get the decimals of the native token
    const decimals = useAppSelector(
        (state) =>
            state.blockchainReducer.chains[SupportedChainKey.Polkadot].tokens[
                nativeTokenKey
            ][network].decimals
    )
    const refreshBalanceKey = useAppSelector(
        (state) => state.refreshReducer.refreshBalanceKey
    )
    const preferenceChainKey = useAppSelector(state => state.blockchainReducer.preferenceChainKey)

    return useSWR(
        address
            ? [
                "POLKADOT_RELAY_BALANCE",
                address,
                refreshBalanceKey,
                tokenKey,
                forceReloadWhenOpenModal ? isOpen : undefined,
            ]
            : null,
        async () => {
            if (preferenceChainKey !== SupportedChainKey.Polkadot) return 0
            try {
                if (tokenKey === PolkadotChainKey.Relay) {
                    const relayChainClient = await polkadotRelayChainClient()
                    const account = await relayChainClient.query.system.account(address)
                    return computeDenomination(account.data.free.toBigInt(), decimals)   
                }
                return 0
            } catch (ex) {
            //error occur mean the address is not valid, or the node is not connected
            // in this case we just return 0
                console.log((ex as Error).message)
                return 0
            }    
        }
    )
}

export const usePolkadotUniqueNetworkBalance = ({
    address,
    tokenKey,
    forceReloadWhenOpenModal,
}: UsePolkadotUniqueNetworkBalanceParams): SWRResponse<number, unknown> => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const refreshBalanceKey = useAppSelector(
        (state) => state.refreshReducer.refreshBalanceKey
    )
    const { isOpen } = usePolkadotTokenDetailsModalDiscloresure()
    const preferenceChainKey = useAppSelector(state => state.blockchainReducer.preferenceChainKey)
    
    return useSWR(
        address
            ? [
                "POLKADOT_UNIQUE_NETWORK_BALANCE",
                address,
                tokenKey,
                refreshBalanceKey,
                forceReloadWhenOpenModal ? isOpen : null,
            ]
            : null,
        async () => {
            if (preferenceChainKey !== SupportedChainKey.Polkadot) return 0
            try {
                if (tokenKey === PolkadotChainKey.UniqueNetwork) {
                    const uniqueNetworkSdkClient = polkadotUniqueNetworkSdkClient(network)
                    const { total, decimals } = await uniqueNetworkSdkClient.balance.get({
                        address,
                    })
                    console.log(total, address, decimals)
                    return computeDenomination(BigInt(total), decimals)
                }
                return 0
            } catch (ex) {
            //error occur mean the address is not valid, or the node is not connected
            // in this case we just return 0
                console.log((ex as Error).message)
                return 0
            }
        }
    )
}

export const usePolkadotMoonbeamBalance = ({
    address,
    tokenKey,
    forceReloadWhenOpenModal,
}: UsePolkadotMoonbeamBalanceParams): SWRResponse<number, unknown> => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const refreshBalanceKey = useAppSelector(
        (state) => state.refreshReducer.refreshBalanceKey
    )
    const { isOpen } = usePolkadotTokenDetailsModalDiscloresure()
    const preferenceChainKey = useAppSelector(state => state.blockchainReducer.preferenceChainKey)
    return useSWR(
        address
            ? [
                "POLKADOT_MOONBEAM_BALANCE",
                address,
                tokenKey,
                refreshBalanceKey,
                forceReloadWhenOpenModal ? isOpen : null,
            ]
            : null,
        async () => {
            if (preferenceChainKey !== SupportedChainKey.Polkadot) return 0
            try {
                const moonbeamProvider = polkadotMoonbeamProvider(network)
                const _address = u8aToHex(addressToEvm(address))
                const decimals =
        chains[SupportedChainKey.Polkadot].tokens[tokenKey][network].decimals
                if (tokenKey === PolkadotChainKey.Moonbeam) {
                    const balance = await moonbeamProvider.getBalance(_address)
                    return computeDenomination(balance, decimals)
                } else {
                    const tokenAddress =
          chains[SupportedChainKey.Polkadot].tokens[tokenKey][network].address
                    const contract = new Contract(tokenAddress, erc20Abi, moonbeamProvider)
                    const [balance, decimals] = await Promise.all([
                        await contract.balanceOf(_address),
                        await contract.decimals(),
                    ])
                    return computeDenomination(balance, Number(decimals))
                }                  
            } catch (ex) {
            //error occur mean the address is not valid, or the node is not connected
            // in this case we just return 0
                console.log((ex as Error).message)
                return 0
            }
        }
    )
}

export const usePolkadotBalances = ({
    address,
    tokenKey,
    forceReloadWhenOpenModal,
}: UsePolkadotBalancesParams): UsePolkadotBalancesReturn => {
    const relayChainBalanceSwr = usePolkadotRelayChainBalance({
        address,
        tokenKey,
        forceReloadWhenOpenModal,
    })
    const uniqueNetworkBalanceSwr = usePolkadotUniqueNetworkBalance({
        address,
        tokenKey,
        forceReloadWhenOpenModal,
    })
    const moonbeamBalanceSwr = usePolkadotMoonbeamBalance({
        address,
        tokenKey,
        forceReloadWhenOpenModal,
    })

    const balances: PolkadotBalances = {
        [PolkadotChainKey.Bifrost]: 0,
        [PolkadotChainKey.Relay]: relayChainBalanceSwr.data || 0,
        [PolkadotChainKey.UniqueNetwork]: uniqueNetworkBalanceSwr.data || 0,
        [PolkadotChainKey.Moonbeam]: moonbeamBalanceSwr.data || 0,
    }

    const loaded =
    relayChainBalanceSwr.isValidating &&
    uniqueNetworkBalanceSwr.isValidating &&
    moonbeamBalanceSwr.isValidating
    const total = Object.values(balances).reduce(
        (acc, balance) => acc + balance,
        0
    )
    return {
        balances,
        loaded,
        total,
    }
}
