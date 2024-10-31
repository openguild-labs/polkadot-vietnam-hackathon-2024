"use client"
import { NftCollectionInfo } from "@/config"
import { useNFTs } from "@/hooks"
import { useAppSelector } from "@/redux"
import { truncateString } from "@/utils"
import { Card, CardBody, CardFooter, Image, Link } from "@nextui-org/react"
import React from "react"

export interface NFTCollectionProps {
  nftCollection: NftCollectionInfo
}

export const NFTCollection = ({ nftCollection }: NFTCollectionProps) => {
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )

    const baseAccounts = useAppSelector(
        (state) => state.authReducer.baseAccounts
    )
    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey

    const { accountAddress } = { ...baseAccounts[preferenceChainKey]?.accounts[activePrivateKey]}
    
    const { nftsSwr } = useNFTs({
        accountAddress,
        chainKey: preferenceChainKey,
        nftCollectionId: nftCollection.collectionId,
        skip: 0,
        take: 5,
    })
    return (
        <div>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                {nftsSwr.data?.records.map((record) => (
                    <Card key={record.tokenId}>
                        <CardBody className="p-3">
                            <div className="aspect-square grid place-items-center">
                                <Image removeWrapper src={record.metadata.image}/>
                            </div>
                        </CardBody>
                        <CardFooter className="py-3 pb-3 pt-0">
                            <div className="flex items-center justify-between w-full">
                                <div className="font-bold text-sm">#{truncateString(record.tokenId, 3, 0) }</div>
                                <Link isExternal showAnchorIcon href={record.tokenId} size="sm">URI</Link>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
