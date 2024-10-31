"use client"
import { useUnity } from "./useUnity"
import { Unity } from "react-unity-webgl"
import React, { useEffect, useState } from "react"
import { HooksProvider } from "./provider.hooks"
import { Avatar, Image } from "@nextui-org/react"
import { useAppSelector } from "@/redux"
import { constantConfig } from "@/config"
import { useRouterWithSearchParams } from "@/hooks"

const TIME_OUT = 2000
const QUIT_EVENT_NAME = "Quit"

export const WrappedUnityCanvas = () => {
    const {
        unity: {
            unityProvider,
            isLoaded,
            sendMessage,
            addEventListener,
            removeEventListener,
        },
    } = useUnity()
    const [devicePixelRatio, setDevicePixelRatio] = useState(
        window.devicePixelRatio
    )

    const router = useRouterWithSearchParams()
    const handleQuit = () => router.push(constantConfig().path.home)

    useEffect(() => {
        addEventListener(QUIT_EVENT_NAME, handleQuit)
        return () => {
            removeEventListener(QUIT_EVENT_NAME, handleQuit)
        }
    }, [addEventListener, removeEventListener, handleQuit])

    useEffect(() => {
        const updateDevicePixelRatio = () => {
            setDevicePixelRatio(window.devicePixelRatio)
        }
        const mediaMatcher = window.matchMedia(
            `screen and (resolution: ${devicePixelRatio}dppx)`
        )
        mediaMatcher.addEventListener("change", updateDevicePixelRatio)
        return () => {
            mediaMatcher.removeEventListener("change", updateDevicePixelRatio)
        }
    }, [devicePixelRatio])

    const cifarmCrendentials = useAppSelector(
        (state) => state.gameReducer.cifarm.credentials
    )
    useEffect(() => {
        if (!isLoaded) return
        setTimeout(() => {
            sendMessage(
                "NakamaService",
                "SetCredentials",
                JSON.stringify(cifarmCrendentials)
            )
        }, TIME_OUT)
    }, [isLoaded])

    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    return (
        <div className="w-full h-full relative">
            {!isLoaded ? (
                <div className="absolute w-full h-full place-items-center grid">
                    <div className="grid place-items-center gap-4 w-full relative">
                        <div className="relative">
                            <Avatar
                                isBordered
                                src={chains[preferenceChainKey]?.imageUrl}
                                classNames={{
                                    base: "absolute w-20 h-20 bottom-0 right-0 z-20 ring-0 bg-background",
                                }}
                            />
                            <Image
                                radius="full"
                                removeWrapper
                                src={"/icons/cifarm.png"}
                                className="w-[160px] h-[160px]"
                            />
                        </div>
                        <div className="text-lg">Game starting...</div>
                    </div>
                </div>
            ) : null}
            <Unity
                className="w-full h-full"
                devicePixelRatio={devicePixelRatio}
                unityProvider={unityProvider}
            />
        </div>
    )
}

export const UnityCanvas = () => {
    return (
        <HooksProvider>
            <WrappedUnityCanvas />
        </HooksProvider>
    )
}