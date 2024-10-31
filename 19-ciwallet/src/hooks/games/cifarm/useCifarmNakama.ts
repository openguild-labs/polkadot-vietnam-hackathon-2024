import { constantConfig, envConfig } from "@/config"
import { setCifarmCredentials, useAppDispatch, useAppSelector } from "@/redux"
import { usePathname } from "next/navigation"
import { Client, Session } from "@heroiclabs/nakama-js"
import { useEffect, useState } from "react"
import {
    Platform,
    chainKeyToPlatform,
    requestMessage,
    signMessage,
} from "@/services"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { useCifarm } from "."
import { triggerErrorToast, triggerSuccessToast } from "@/toasts"
import { consoleLogError } from "@/utils"
import { useRouterWithSearchParams } from "@/hooks/miscellaneous"

export interface UseCifarmNakamaReturn {
  authSwr: SWRMutationResponse<void, unknown>;
  client: Client | undefined;
  session: Session | undefined;
}

export const _useCifarmNakama = (): UseCifarmNakamaReturn => {
    const [client, setClient] = useState<Client | undefined>()
    const [session, setSession] = useState<Session | undefined>()

    const pathname = usePathname()
    const mnemonic = useAppSelector((state) => state.authReducer.mnemonic)
    const referrerUserId = useAppSelector((state) => state.authReducer.telegramInfo.referrerUserId)
    const telegramInitDataRaw = useAppSelector((state) => state.authReducer.telegramInfo.initDataRaw)

    useEffect(() => {
        if (pathname != constantConfig().path.cifarm) return
        if (mnemonic === "") return

        const client = new Client(
            envConfig().externals.cifarm.core.key,
            envConfig().externals.cifarm.core.host,
            envConfig().externals.cifarm.core.port,
            envConfig().externals.cifarm.core.useSsl
        )
        setClient(client)
    }, [pathname, mnemonic])

    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const baseAccounts = useAppSelector((state) => state.authReducer.baseAccounts)
    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    const { accountAddress, publicKey } = {...baseAccounts[preferenceChainKey]?.accounts[activePrivateKey]}

    const network = useAppSelector((state) => state.blockchainReducer.network)
    const dispatch = useAppDispatch()
    const botType = useAppSelector((state) => state.authReducer.botType)
    
    const router = useRouterWithSearchParams()
    const finishDownloaded = useAppSelector((state) => state.gameReducer.cifarm.finishDownloaded)

    const authSwr = useSWRMutation("CIFARM_AUTH_SWR", async () => {
        try {
            if (!finishDownloaded) return
            const {
                data: { message },
            } = await requestMessage()
            if (!activePrivateKey) return
            if (!publicKey) return
            if (!accountAddress) return
 
            const signature = await signMessage({
                chainKey: preferenceChainKey,
                message,
                privateKey: activePrivateKey,
                publicKey,
            })
            if (!client) return
            let _publicKey = publicKey
            const platform = chainKeyToPlatform(preferenceChainKey)
            if (platform === Platform.Evm) {
                _publicKey = accountAddress
            }
        
            const session = await client.authenticateCustom(
                "starci",
                false,
                undefined,
                {
                    message,
                    publicKey: _publicKey,
                    signature,
                    chainKey: preferenceChainKey,
                    network,
                    referrerUserId,
                    telegramInitDataRaw,
                    botType,
                    accountAddress
                }
            )
            triggerSuccessToast("Game authenticated successfully")
            setSession(session)
            dispatch(
                setCifarmCredentials({
                    chainKey: preferenceChainKey,
                    message,
                    network,
                    publicKey: _publicKey,
                    signature,
                    telegramInitDataRaw,
                    botType,
                    accountAddress,
                })
            )} catch (ex) {
            consoleLogError(ex)
            triggerErrorToast("Game authentication failed. Try again later")
            router.push(constantConfig().path.home)
        }
    })

    return {
        authSwr,
        client,
        session,
    }
}

export const useCifarmNakama = () => {
    const { cifarmNakama } = useCifarm() 
    return cifarmNakama
}
