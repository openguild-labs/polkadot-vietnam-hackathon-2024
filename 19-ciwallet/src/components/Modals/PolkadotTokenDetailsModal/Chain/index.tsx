import { Network, PolkadotChain } from "@/config"
import { useAppSelector } from "@/redux"
import { WithKey } from "@/utils"
import { Card, CardBody, Avatar, Image } from "@nextui-org/react"
import React from "react"

export interface ChainProps {
    chain: WithKey<Record<Network, PolkadotChain>>
    balance: number
}

export const Chain = ({ chain, balance }: ChainProps) => {
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const polkadotSelectedToken = useAppSelector((state) => state.miscellaneousReducer.polkadotSelectedToken)
    return (
        <Card key={chain.key} shadow="none" fullWidth>
            <CardBody className="p-3 bg-content2">
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <Avatar
                            isBordered
                            src={chain[network].imageUrl}
                            classNames={{
                                base: "absolute w-5 h-5 bottom-0 right-0 z-20 ring-0 bg-background",
                            }}
                        />
                        <Image
                            removeWrapper
                            src={polkadotSelectedToken?.imageUrl}
                            className="w-10 h-10"
                        />
                    </div>
                    <div>
                        <div>{`${polkadotSelectedToken?.name} (${chain[network].name})`}</div>
                        <div className="text-sm text-foreground-400">
                            {balance} {polkadotSelectedToken?.symbol}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}