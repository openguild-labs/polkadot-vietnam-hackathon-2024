"use client"
import { useAppSelector } from "@/redux"
import React from "react"
import {
    Accordion,
    AccordionItem,
    Card,
    CardBody,
    Image,
    Link,
    Spacer,
} from "@nextui-org/react"
import { NFTCollection } from "./NFTCollection"
import { truncateString, valuesWithKey } from "@/utils"
import { SupportedChainKey } from "@/config"

export const NFTs = () => {
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )

    const nftGroups = useAppSelector(
        (state) => state.blockchainReducer.chains[preferenceChainKey].nftGroups
    )
    const groupKeys = Object.keys(nftGroups)
    const network = useAppSelector((state) => state.blockchainReducer.network)
    return (
        <div>
            {preferenceChainKey === SupportedChainKey.Polkadot ? (
                <>
                    <div className="text-foreground-400 text-sm">
                    For Polkadot, we display NFTs exclusively in Unique Network, as this parachain strongly supports NFTs.
                    </div>
                    <Spacer y={4} />
                </>
            ) : null}

            {groupKeys.map((groupKey) => {
                const nftGroup = nftGroups[groupKey]
                const collections = nftGroup.collections
                return (
                    <Card key={groupKey}>
                        <CardBody className="p-3">
                            <div className="flex gap-2 items-center">
                                <Image
                                    removeWrapper
                                    className="w-7 h-7"
                                    src={nftGroup.imageUrl}
                                />
                                <div className="font-bold text-xl">{nftGroup.name}</div>
                            </div>
                            <Spacer y={4} />
                            <Accordion
                                isCompact
                                itemClasses={{
                                    title: "text-base",
                                }}
                            >
                                {valuesWithKey(collections).map((collection) => {
                                    return (
                                        <AccordionItem
                                            startContent={
                                                <Image
                                                    className="w-6"
                                                    removeWrapper
                                                    src={collection[network].imageUrl}
                                                />
                                            }
                                            key={collection.key}
                                            aria-label={collection.key}
                                            title={
                                                <div className="flex gap-2">
                                                    {collection[network].name}
                                                    <Link
                                                        className="font-bold"
                                                        isExternal
                                                        size="sm"
                                                        color="foreground"
                                                    >
                            ({truncateString(collection[network].collectionId)})
                                                    </Link>
                                                </div>
                                            }
                                        >
                                            <NFTCollection
                                                nftCollection={collection[network]}
                                                key={collection.key}
                                            />
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </CardBody>
                    </Card>
                )
            })}
        </div>
    )
}
