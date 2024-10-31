"use client"
import { useAppSelector } from "@/redux"
import React from "react"
import { Container } from "@/components"
import { Card, CardBody, CardFooter, Image, Link, Spacer } from "@nextui-org/react"
import { ArrowLeftIcon } from "lucide-react"
import { constantConfig } from "@/config"
import { useRouterWithSearchParams } from "@/hooks"

const Page = () => {
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const router = useRouterWithSearchParams()
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const wormhole = chains[preferenceChainKey].wormhole
    const noBridgeSupported = !wormhole

    return (
        <Container hasPadding >
            <div>
                <div className="flex gap-2 items-center">
                    <Link as="button" onPress={() => router.back()} color="foreground">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div className="text-2xl font-bold">Select Protocol</div>
                </div>
                <Spacer y={4} />
                <div className="text-xs text-foreground-400">
                    Select the protocol you want to use to transfer assets between chains
                </div>
                <Spacer y={6} />
                {
                    noBridgeSupported ? <div>Sorry, we currently do not support bridge for this chain.</div>
                        : <div className="grid gap-4 grid-cols-2">
                            {wormhole ? (
                                <Card onPress={() => router.push(constantConfig().path.bridgeWormhole)} className="h-fit" key="wormhole" isPressable>
                                    <CardBody className="p-4">
                                        <Image src="/icons/wormhole.svg" className="w-full" />
                                    </CardBody>
                                    <CardFooter className="p-4 pt-2">Wormhole</CardFooter>
                                </Card>
                            ) : null}
                        </div>
                }
            </div>
        </Container>
    )
}

export default Page
