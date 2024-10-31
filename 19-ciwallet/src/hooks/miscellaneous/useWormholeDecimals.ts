import { defaultChain, nativeTokenKey } from "@/config"
import { useAppSelector } from "@/redux"
import { getDecimals, parseNetwork } from "@/services"
import useSWR, { SWRResponse } from "swr"

export interface UseWormholeDecimalsParams {
  tokenAddress: string;
  chainKey: string;
}

export interface UseWormholeDecimalsReturn {
  decimalsSwr: SWRResponse<number, unknown>;
}

export const useWormholeDecimals = ({
    tokenAddress,
    chainKey,
}: UseWormholeDecimalsParams): UseWormholeDecimalsReturn => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const chains = useAppSelector((state) => state.blockchainReducer.chains)

    const decimalsSwr = useSWR(
        ["WORMHOLE_DECIMALS_SWR", tokenAddress, chainKey],
        async () => {
            if (!tokenAddress) return chains[chainKey].tokens[nativeTokenKey][network].decimals
            return await getDecimals({
                chainName: chains[chainKey].wormhole?.chain ?? defaultChain,
                network: parseNetwork(network),
                tokenAddress,
            })
        }
    )
    return {
        decimalsSwr,
    }
}
