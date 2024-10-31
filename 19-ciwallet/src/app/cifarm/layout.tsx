"use client"

import { useCifarmNakama } from "@/hooks"
import { useAppSelector } from "@/redux"
import React, { PropsWithChildren, useEffect } from "react"

const Layout = ({ children }: PropsWithChildren) => {
    const { authSwr, client } = useCifarmNakama()
    const finishDownloaded = useAppSelector(
        (state) => state.gameReducer.cifarm.finishDownloaded
    )
    useEffect(() => {
        if (!client) return
        if (!finishDownloaded) return
        const handleEffect = async () => {
            await authSwr.trigger()
        }
        handleEffect()
    }, [client, finishDownloaded])

    return <>{children}</>
}

export default Layout
