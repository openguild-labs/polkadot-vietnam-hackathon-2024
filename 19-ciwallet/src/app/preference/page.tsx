"use client"
import React from "react"
import { Container } from "@/components"
import { Button, Image, Select, SelectItem, Spacer } from "@nextui-org/react"
import { blockchainConfig, chainInfos, constantConfig, defaultChainKey } from "@/config"
import { setPreferenceChainKey, useAppDispatch, useAppSelector } from "@/redux"
import { useRouterWithSearchParams } from "@/hooks"

const Page = () => {
    const dispatch = useAppDispatch()
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const router = useRouterWithSearchParams()

    return (
        <Container centerContent hasPadding>
            <div className="w-full">
                <div className="text-2xl font-bold">Select your preference chain</div>
                <Spacer y={6} />
                <Select
                    size="lg"
                    startContent={
                        <Image
                            className="w-6 h-6"
                            src={
                                blockchainConfig().chains[preferenceChainKey]
                                    ?.imageUrl
                            }
                        />
                    }
                    aria-label="Select your preference chain"
                    selectedKeys={[preferenceChainKey]}
                    onSelectionChange={(keys) => {
                        const selectedChain = keys.currentKey  ?? defaultChainKey
                        dispatch(setPreferenceChainKey(selectedChain))
                    }}
                >
                    {chainInfos.map(({ key, name, imageUrl }) => (
                        <SelectItem
                            startContent={<Image className="w-5 h-5" src={imageUrl} />}
                            key={key}
                            value={key}
                        >
                            {name}
                        </SelectItem>
                    ))}
                </Select>
                <Spacer y={6} />
                <Button
                    onPress={() => {
                        router.push(constantConfig().path.nearUsername)
                    }}
                    color="primary"
                    fullWidth
                >
          Continue
                </Button>
            </div>
        </Container>
    )
}

export default Page
