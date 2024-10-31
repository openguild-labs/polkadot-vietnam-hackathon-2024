"use client"

import React, { PropsWithChildren, useEffect } from "react"
import { case2 } from "./fns"
import { createAttestation, getWrappedAsset } from "@/services"

export interface TestProviderProps extends PropsWithChildren {
    isTesting: boolean
}

export const TestProvider = ({ children, isTesting } : TestProviderProps) => {
    useEffect(() => {
        const handleEffect = async () => {
            if (!isTesting) return
            // Test code here
            // case1()
            case2()
            const wrapped = await getWrappedAsset({
                foreignChainName: "Aptos",
                network: "Testnet",
                sourceChainName: "Solana",
                sourceTokenAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
            })
            console.log(wrapped)    
        }
        handleEffect()
    }, [])
    return <>{!isTesting ? children : null}</>
}