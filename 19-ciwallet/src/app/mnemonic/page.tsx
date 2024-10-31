"use client"
import { Container } from "@/components"
import React, { useEffect, useState } from "react"
import { MnemonicWords, downloadTextFile } from "@/services"
import {
    setMnemonic,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    Avatar,
    AvatarGroup,
    Button,
    Snippet,
    Spacer,
    Tab,
    Tabs,
} from "@nextui-org/react"
import { constantConfig } from "@/config"
import { getMnemonic } from "@/services"
import { valuesWithKey } from "@/utils"
import { useRouterWithSearchParams } from "@/hooks"

const Page = () => {
    const dispatch = useAppDispatch()
    const mnemonic = useAppSelector((state) => state.authReducer.mnemonic)
    const [use24Words, setUse24Words] = useState(true)

    useEffect(() => {
        const mnemonic = getMnemonic(
            use24Words ? MnemonicWords._24_WORDS : MnemonicWords._12_WORDS
        )
        dispatch(setMnemonic(mnemonic))
    }, [use24Words])

    const router = useRouterWithSearchParams()

    const chains = valuesWithKey(
        useAppSelector((state) => state.blockchainReducer.chains)
    )

    return (
        <Container hasPadding centerContent>
            <div className="w-full">
                <div className="text-2xl font-bold">Mnemonic</div>
                <Spacer y={6} />
                <div>
                    <div>
                        <div className="w-full flex justify-between">
                            <div className="flex gap-2 items-center">
                                <AvatarGroup classNames={{
                                    count: "w-5 h-5",
                                }}>
                                    {chains.map((chain) => (
                                        <Avatar
                                            key={chain.key}
                                            classNames={{
                                                base: "w-5 h-5 bg-background",
                                            }}
                                            src={chain.imageUrl}
                                        />
                                    ))}
                                </AvatarGroup>
                                <div className="text-sm">{chains.length}+ chains</div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Tabs
                                    selectedKey={use24Words ? "24words" : "12words"}
                                    onSelectionChange={(key) => setUse24Words(key === "24words")}
                                    size="sm"
                                >
                                    <Tab key="12words" title="12 words" />
                                    <Tab key="24words" title="24 words" />
                                </Tabs>
                            </div>
                        </div>
                        <Spacer y={2} />
                        <Snippet
                            hideSymbol
                            classNames={{ pre: "text-justify !whitespace-pre-line" }}
                            className="w-full min-h-[100px]"
                        >
                            {mnemonic ||
                "lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum"}
                        </Snippet>
                    </div>
                </div>
                <Spacer y={12} />
                <Button
                    onPress={() => router.push(constantConfig().path.preference)}
                    color="primary"
                    fullWidth
                >
          Continue
                </Button>
                <Spacer y={2} />
                <Button
                    onPress={() =>
                        downloadTextFile(
                            "mnemonic.txt",
                            mnemonic
                        )
                    }
                    color="primary"
                    variant="bordered"
                    fullWidth
                >
          Save
                </Button>
            </div>
        </Container>
    )
}

export default Page
