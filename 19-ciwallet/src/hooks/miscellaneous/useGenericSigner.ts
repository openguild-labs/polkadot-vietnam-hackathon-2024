import { useAppSelector } from "@/redux"
import {
    chainKeyToChain,
    parseNetwork,
    signer,
} from "@/services"
import { valuesWithKey } from "@/utils"
import { Chain, SignAndSendSigner, Network } from "@wormhole-foundation/sdk"

export const useGenericSigner = <N extends Network, C extends Chain>(
    chainKey?: string,
    address?: string
): SignAndSendSigner<N, C> | undefined => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const baseAccounts = useAppSelector(
        (state) => state.authReducer.baseAccounts
    )
    const chains = useAppSelector(state => state.blockchainReducer.chains)
    if (!chainKey) return
    if (!chains[chainKey].wormhole) return    
    
    if (!address) return
    const account = valuesWithKey(baseAccounts[chainKey]?.accounts ?? {}).find(({ accountAddress }) => accountAddress === address)
    if (!account) return 

    const chain = chainKeyToChain(chainKey)
    return signer({
        chain,
        network: parseNetwork(network),
        privateKey: account.key,
        address: account.accountAddress,
        debug: true,
    }) as unknown as SignAndSendSigner<N, C>
}
