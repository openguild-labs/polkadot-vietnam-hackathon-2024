import { useAppSelector } from "@/redux"
import { BlockchainTokenService, TokenMetadata } from "@/services"
import useSWR, { SWRResponse } from "swr"

export interface UseTokenMetadata2Params {
  tokenAddress: string;
  chainKey: string;
}

export interface UseTokenMetadata2Return {
  tokenMetadataSwr: SWRResponse<TokenMetadata, unknown>;
}

export const useTokenMetadata2 = ({
    tokenAddress,
    chainKey,
}: UseTokenMetadata2Params): UseTokenMetadata2Return => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const tokenMetadataSwr = useSWR(
        ["TOKEN_METADATA_2_SWR", tokenAddress],
        async () => {
            const tokenService = new BlockchainTokenService({
                chainKey,
                tokenAddress,
                network,
            })

            return await tokenService.getTokenMetadata()
        }
    )

    return {
        tokenMetadataSwr,
    }
}
