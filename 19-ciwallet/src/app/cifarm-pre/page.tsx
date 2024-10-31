"use client"
import { Container } from "@/components"
import { constantConfig } from "@/config"
import { useRouterWithSearchParams } from "@/hooks"
import { useAppSelector } from "@/redux"
import { Avatar, Button, Image, Spacer } from "@nextui-org/react"
import React from "react"

const Page = () => {
    const router = useRouterWithSearchParams()
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    return (
        <Container centerContent hasPadding>
            <div className="absolute w-full h-full place-items-center grid">
                <div className="grid place-items-center gap-12 w-full relative">
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
                    <div>
                        <Button
                            className="w-[300px]"
                            onPress={() => router.push(constantConfig().path.cifarm)}
                            color="primary"
                            fullWidth
                        >
          Play
                        </Button>
                        <Spacer y={2} />
                        <Button
                            className="w-[300px]"
                            onPress={() =>
                                router.push(constantConfig().path.home)
                            }
                            color="primary"
                            variant="bordered"
                            fullWidth
                        >
          Back
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Page
