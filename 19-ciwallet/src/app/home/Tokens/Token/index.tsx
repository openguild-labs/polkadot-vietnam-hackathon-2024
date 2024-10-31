"use client"

import {
    SupportedChainKey,
    TokenInfo,
} from "@/config"
import {
    useBalance,
    usePolkadotBalances,
    usePolkadotTokenDetailsModalDiscloresure,
} from "@/hooks"
import { setPolkadotSelectedToken, useAppDispatch, useAppSelector } from "@/redux"
import React from "react"
import { Avatar, Card, CardBody, Image } from "@nextui-org/react"
import { WithKey } from "@/utils"
import { ChevronRight } from "lucide-react"

export interface TokenProps {
  token: WithKey<TokenInfo>;
}

export const Token = ({ token }: TokenProps) => {
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const baseAccounts = useAppSelector(
        (state) => state.authReducer.baseAccounts
    )
    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    const account = baseAccounts[preferenceChainKey]?.accounts[activePrivateKey]
    const { accountAddress } = { ...account }

    const { balanceSwr } = useBalance({
        accountAddress:
      preferenceChainKey !== SupportedChainKey.Polkadot ? accountAddress : "",
        chainKey: preferenceChainKey,
        tokenKey: token.key,
    })

    
    const { total } = usePolkadotBalances({
        address:
      preferenceChainKey === SupportedChainKey.Polkadot ? accountAddress : "",
        tokenKey: token.key,
    })

    const { data } = { ...balanceSwr }
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const chain = chains[preferenceChainKey]
    const { onOpen } = usePolkadotTokenDetailsModalDiscloresure()
    const dispatch = useAppDispatch()
    
    const render = () => {
        if (preferenceChainKey === SupportedChainKey.Polkadot) {
            return (
                <Card onPress={() => {
                    onOpen()
                    dispatch(setPolkadotSelectedToken(token))
                }} isPressable shadow="none" fullWidth>
                    <CardBody className="p-3 bg-content2">
                        <div className="justify-between flex items-center">
                            <div className="flex gap-2 items-center">
                                <div className="relative">
                                    <Avatar
                                        isBordered
                                        src={chain?.imageUrl}
                                        classNames={{
                                            base: "absolute w-5 h-5 bottom-0 right-0 z-20 ring-0 bg-background",
                                        }}
                                    />
                                    <Image
                                        removeWrapper
                                        src={token?.imageUrl}
                                        className="w-10 h-10"
                                    />
                                </div>
                                <div>
                                    <div>{token?.name}</div>
                                    <div className="text-sm text-foreground-400">
                                        {total} {token?.symbol}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-foreground-400" />
                        </div>
                    </CardBody>
                </Card>
            )
        }
        return (
            <Card shadow="none" fullWidth>
                <CardBody className="p-3 bg-content2">
                    <div className="flex gap-2 items-center">
                        <div className="relative">
                            <Avatar
                                isBordered
                                src={chain?.imageUrl}
                                classNames={{
                                    base: "absolute w-5 h-5 bottom-0 right-0 z-20 ring-0 bg-background",
                                }}
                            />
                            <Image
                                removeWrapper
                                src={token?.imageUrl}
                                className="w-10 h-10"
                            />
                        </div>

                        <div>
                            <div>{token?.name}</div>
                            <div className="text-sm text-foreground-400">
                                {data || 0} {token?.symbol}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }
    return render()
}
