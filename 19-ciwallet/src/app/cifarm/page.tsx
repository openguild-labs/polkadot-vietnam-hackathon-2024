"use client"
import { Container } from "@/components"
import React from "react"
import { UnityCanvas } from "./UnityCanvas"
import { useCifarmDb } from "@/hooks"
import { Downloading } from "./Downloading"

const Page = () => {
    const { finishDownloaded } = useCifarmDb()
    return (
        <Container centerContent>
            { finishDownloaded ? <UnityCanvas /> : <Downloading /> }
        </Container>
    )
}

export default Page
