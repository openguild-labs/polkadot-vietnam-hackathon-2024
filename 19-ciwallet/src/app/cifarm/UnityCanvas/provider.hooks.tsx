"use client"

import React, { PropsWithChildren, createContext } from "react"
import { UseUnityReturn, _useUnity } from "./useUnity"

interface HookContextsValue {
    unity: UseUnityReturn
}
export const HooksContext = createContext<HookContextsValue | null>(null)

export const HooksProvider = ({ children } : PropsWithChildren) => {
    const unity = _useUnity()
    
    return (
        <HooksContext.Provider value={{
            unity
        }}>
            {children}
        </HooksContext.Provider>
    )
}