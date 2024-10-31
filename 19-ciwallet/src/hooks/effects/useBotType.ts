import { setBotType, setBotTypeInit, useAppDispatch } from "@/redux"
import { BotType, defaultBotType } from "@/services"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export const useBotType = () => {
    const searchParams = useSearchParams()
    const botType = searchParams.get("botType") as BotType || defaultBotType

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setBotType(botType))
        dispatch(setBotTypeInit(botType))
    }, [])
}