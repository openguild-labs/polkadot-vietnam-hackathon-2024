import { envConfig } from "@/config"
import { setTelegramInfo, useAppDispatch } from "@/redux"
import { retrieveLaunchParams, postEvent  } from "@telegram-apps/sdk"
import { useEffect } from "react"

export const useTelegramMiniApp = () => {
    if (typeof window === "undefined") return
    if (envConfig().isDev) return
    const { initData, initDataRaw } = retrieveLaunchParams()

    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!initData) return
        if (!initDataRaw) return
        postEvent("web_app_expand")
        dispatch(setTelegramInfo({
            id: initData?.user?.id || 0, 
            username: initData?.user?.username || "",
            referrerUserId: initData?.startParam || "",
            initDataRaw,
        }))
    }, [initData])
}