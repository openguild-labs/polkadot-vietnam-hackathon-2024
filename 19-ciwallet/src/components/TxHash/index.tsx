"use client"
import { bridgeProtocols } from "@/config"
import { useAppSelector } from "@/redux"
import { explorerUrl, protocolExplorerUrl } from "@/services"
import { truncateString } from "@/utils"
import { Image, Link } from "@nextui-org/react"
import React from "react"

export interface TxHashProps {
    chainKey: string,
    txHash: string
    bridgeProtocolKey: string
}
export const TxHash = ({ chainKey, txHash, bridgeProtocolKey }: TxHashProps) => {
    const protocol = bridgeProtocols[bridgeProtocolKey]
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const chain = chains[chainKey]

    return (
        <div className="flex gap-2 items-center">
            <div className="text-sm">{truncateString(txHash)}</div> 
            <div className="flex gap-1 items-center">
                <Link size="sm" isExternal href={explorerUrl({
                    chainKey: chainKey,
                    value: txHash,
                    type: "tx",
                    network
                })}>
                    <Image removeWrapper className="w-5 h-5" src={chain.imageUrl}/>
                </Link>  
                <Link size="sm" isExternal href={protocolExplorerUrl({
                    bridgeProtocolKey,
                    value: txHash,
                    network,
                    type: "tx"
                })}>
                    <Image removeWrapper className="w-5 h-5" src={protocol.imageUrl}/>
                </Link>      
            </div>
        </div>
    )
}