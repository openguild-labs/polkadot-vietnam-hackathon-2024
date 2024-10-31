import { SupportedChainKey } from "@/config"
import { useAppSelector } from "@/redux"
import { BlockchainTokenService } from "@/services"
import useSWR, { SWRResponse } from "swr"

export interface UseBalanceParams {
  accountAddress: string;
  tokenKey: string;
  chainKey: string;
}

export interface UseBalanceReturn {
  balanceSwr: SWRResponse<number | undefined, unknown>;
}

export const useBalance = ({
    accountAddress,
    tokenKey,
    chainKey,
}: UseBalanceParams): UseBalanceReturn => {
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )

    const refreshBalanceKey = useAppSelector(
        (state) => state.refreshReducer.refreshBalanceKey
    )
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const chains = useAppSelector((state) => state.blockchainReducer.chains)

    const balanceSwr = useSWR(
        [
            "BALANCE_SWR",
            tokenKey,
            refreshBalanceKey,
            chainKey
        ],
        async () => {
            //dont fetch balance for polkadot
            if (preferenceChainKey === SupportedChainKey.Polkadot) return

            if (!accountAddress) return 
            const tokenService = new BlockchainTokenService({
                chainKey,
                tokenAddress:
          chains[chainKey].tokens[tokenKey][network].address,
                network,
            })
            return await tokenService.getBalance({ accountAddress })
        }
    )

    return {
        balanceSwr,
    }
}
