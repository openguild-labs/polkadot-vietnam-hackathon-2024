import { useAppSelector } from "@/redux"
import {
    BlockchainNftService,
    GetNftsByOwnerAddressResult,
} from "@/services"
import useSWR, { SWRResponse } from "swr"

export interface UseNFTsParams {
  accountAddress: string;
  nftCollectionId: string;
  chainKey: string;
  skip?: number;
  take?: number;
}

export interface UseNFTsReturn {
    nftsSwr: SWRResponse<GetNftsByOwnerAddressResult, unknown>;
}

export const useNFTs = ({
    accountAddress,
    nftCollectionId,
    chainKey,
    skip,
    take,
}: UseNFTsParams): UseNFTsReturn => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const nftsSwr = useSWR(["NFTS_SWR", nftCollectionId, accountAddress, skip, take], async () => {
        skip = skip || 0
        take = take || 5
        const nftService = new BlockchainNftService({
            chainKey,
            nftCollectionId,
            network,
        })
        const emptyResult: GetNftsByOwnerAddressResult = {
            records: [],
            count: 0,
        }
        if (!accountAddress) return emptyResult
        return await nftService.getNftsByOwnerAddress({
            accountAddress,
            skip,
            take,
        })
    })

    return {
        nftsSwr,
    }
}
