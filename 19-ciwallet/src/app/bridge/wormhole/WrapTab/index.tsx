"use client"
import { defaultChain, defaultSecondaryChain } from "@/config"
import {
    useBridgeWrapFormik,
    useBridgeWrapModalDisclosure,
    useBridgeWrapSelectTokenModalDisclosure,
} from "@/hooks"
import {
    setBridgeWrappedTokens,
    useAppDispatch,
    useAppSelector,
    WrappedToken,
} from "@/redux"
import {
    getOriginalAsset,
    getWrappedAsset,
    hasWrappedAsset,
    parseNetwork,
    toWormholeNative,
} from "@/services"
import { truncateString, valuesWithKey } from "@/utils"
import {
    Image,
    Button,
    Spacer,
    ScrollShadow,
    Avatar,
    Card,
    CardBody,
    Snippet,
    Skeleton,
} from "@nextui-org/react"
import React from "react"
import useSWR from "swr"

export const WrapTab = () => {
    const formik = useBridgeWrapFormik()
    const { onOpen } = useBridgeWrapSelectTokenModalDisclosure()
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    
    //wormhole only
    const supportWormhole = !!chains[preferenceChainKey].wormhole

    const sourceChainName = chains[preferenceChainKey].wormhole?.chain ?? defaultChain

    const network = useAppSelector((state) => state.blockchainReducer.network)
    const tokens = chains[preferenceChainKey].tokens
    const token = tokens[formik.values.tokenKey]
    const { imageUrl, name, symbol } = { ...token[network] }

    const dispatch = useAppDispatch()
    const wrappedTokens = useAppSelector(
        (state) => state.resultReducer.bridge.wrappedTokens
    )

    const { isValidating } = useSWR(
        supportWormhole ? ["FETCH_WRAPPED_TOKENS", formik.values.tokenKey, preferenceChainKey] : null,
        async () => {
            const wrappedTokens: Record<string, WrappedToken> = {}
            const promises: Array<Promise<void>> = []
            for (const chain of valuesWithKey(chains).filter(chain => !!chain.wormhole)) {
                const promise = async () => {
                    try {
                        if (chain.wormhole?.chain === sourceChainName) return
                        const has = await hasWrappedAsset({
                            network: parseNetwork(network),
                            sourceChainName,
                            foreignChainName: chain.wormhole?.chain ?? defaultSecondaryChain,
                            sourceTokenAddress: token[network].address,
                        })    
                        if (has) {
                            const tokenAddress = await getWrappedAsset({
                                network: parseNetwork(network),
                                sourceChainName,
                                foreignChainName: chain.wormhole?.chain ?? defaultSecondaryChain,
                                sourceTokenAddress: token[network].address,
                            })
                            if (tokenAddress) {
                                wrappedTokens[chain.wormhole?.chain ?? defaultChain] = {
                                    key: chain.key,
                                    tokenAddress: toWormholeNative(chain.wormhole?.chain ?? defaultChain, tokenAddress),
                                }
                            }
                        }
                    } catch (ex) {
                        console.error(ex)
                    }
                }
                promises.push(promise())
            }
            await Promise.all(promises)
            dispatch(setBridgeWrappedTokens(wrappedTokens))
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )

    const originalAssetSwr = useSWR(
        supportWormhole ? ["ORIGINAL_ASSET", formik.values.tokenKey] : null,
        async () => {
            const token = chains[preferenceChainKey].tokens[formik.values.tokenKey]
            return await getOriginalAsset({
                chainName: chains[preferenceChainKey].wormhole?.chain ?? defaultChain,
                network: parseNetwork(network),
                tokenAddress: token[network].address,
            })
        }
    )

    const { onOpen: onBridgeWrapModalOpen } = useBridgeWrapModalDisclosure()

    const isOriginal =
    !originalAssetSwr.data ||
    originalAssetSwr.data?.chain === chains[preferenceChainKey].wormhole?.chain
    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div>
                <div>
                    <div>
                        <div className="text-sm">Select Token</div>
                        <Spacer y={1.5} />
                    </div>
                    <Button className="px-3 bg-content2" onPress={onOpen} fullWidth>
                        <div className="flex gap-2 items-center w-full">
                            <div className="flex gap-2 items-center">
                                <Image className="w-5 h-5" src={imageUrl} />
                                <div className="flex gap-1 items-center">
                                    <div>{name}</div>
                                    <div className="text-foreground-400">{symbol}</div>
                                </div>
                            </div>
                        </div>
                    </Button>
                </div>
                <Spacer y={4} />
                <div>
                    {isOriginal ? (
                        <div>
                            <div>
                                <div className="text-sm">Wrapped Tokens</div>
                                <Spacer y={1.5} />
                            </div>
                            <ScrollShadow className="h-[300px] w-full" hideScrollBar>
                                {isValidating ? (
                                    <div className="grid gap-2">
                                        <Skeleton className="w-full h-16 rounded-medium" />
                                        <Skeleton className="w-full h-16 rounded-medium" />
                                    </div>
                                ) : (
                                    <div className="gap-2 grid">
                                        {Object.values(wrappedTokens).map((wrappedToken) => (
                                            <Card key={wrappedToken.key} shadow="none" fullWidth>
                                                <CardBody className="p-3 bg-content2">
                                                    <div className="flex gap-2 items-center">
                                                        <div className="relative">
                                                            <Avatar
                                                                isBordered
                                                                src={chains[wrappedToken.key].imageUrl}
                                                                classNames={{
                                                                    base: "absolute w-5 h-5 bottom-0 right-0 z-20 ring-0 bg-background",
                                                                }}
                                                            />
                                                            <Image
                                                                removeWrapper
                                                                src={token[network]?.imageUrl}
                                                                className="w-10 h-10"
                                                            />
                                                        </div>
                                                        <Snippet
                                                            hideSymbol
                                                            classNames={{
                                                                base: "p-0 bg-inhenrit",
                                                                pre: "font-inherit",
                                                            }}
                                                            size="sm"
                                                            codeString={wrappedToken.tokenAddress}
                                                        >
                                                            <div>
                                                                <div className="flex gap-1 text-sm items-center">
                                                                    <div>{name}</div>
                                                                    <div className="text-foreground-400">
                                                                        {symbol}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs text-foreground-400">
                                                                    {truncateString(wrappedToken.tokenAddress)}
                                                                </div>
                                                            </div>
                                                        </Snippet>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </ScrollShadow>
                        </div>
                    ) : (
                        <div>
                            <div className="text-sm">This is a wrapped token.</div>
                            <Spacer y={1} />
                            <div className="flex gap-2 items-center">
                                <div className="text-sm">Original Chain:</div>
                                <div className="flex gap-1 items-center">
                                    <Image
                                        removeWrapper
                                        className="w-5 h-5"
                                        src={
                                            valuesWithKey(chains).find(
                                                (chain) => chain.wormhole?.chain === originalAssetSwr.data?.chain
                                            )?.imageUrl
                                        }
                                    />
                                    <div>
                                        {
                                            valuesWithKey(chains).find(
                                                (chain) => chain.wormhole?.chain === originalAssetSwr.data?.chain
                                            )?.name
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Button
                color="primary"
                isDisabled={!isOriginal}
                onPress={onBridgeWrapModalOpen}
            >
        Create Wrapped
            </Button>
        </div>
    )
}
