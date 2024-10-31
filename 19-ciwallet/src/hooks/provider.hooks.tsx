"use client"

import React, { createContext, PropsWithChildren } from "react"
import { _useModals, UseModalReturn } from "./modals"
import { useEffects } from "./effects"
import { _useFormiks, UseFormiksReturn } from "./formiks"
import { _useGames, UseGamesReturn } from "./games"

interface HookContextsValue {
    modals: UseModalReturn
    formiks: UseFormiksReturn
    games: UseGamesReturn
}
export const HooksContext = createContext<HookContextsValue | null>(null)

export const HooksProvider = ({ children } : PropsWithChildren) => {
    const modals = _useModals()
    const formiks = _useFormiks()
    const games = _useGames()
    useEffects()

    return (
        <HooksContext.Provider value={{
            modals,
            formiks,
            games
        }}>
            {children}
        </HooksContext.Provider>
    )
}