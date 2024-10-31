"use client"

import { setActivePrivateKey, useAppDispatch, useAppSelector } from "@/redux"
import { StoredAccount } from "@/services"
import { truncateString, WithKey } from "@/utils"
import { Card, CardBody, User, CheckboxIcon } from "@nextui-org/react"
import React from "react"

interface AccountUserProps {
    account: WithKey<StoredAccount>
    activePrivateKey: string
}

export const AccountUser = ({account: { imageUrl, name, accountAddress, key }, activePrivateKey}: AccountUserProps) => {
    const preferenceChainKey = useAppSelector(state => state.blockchainReducer.preferenceChainKey)
    const dispatch = useAppDispatch()

    return (
        <Card classNames={{
            base: "!bg-transparent"
        }} disableRipple isPressable onPress={() => dispatch(setActivePrivateKey({
            privateKey: key,
            chainKey: preferenceChainKey
        }))} fullWidth shadow="none">
            <CardBody className="px-3 py-2">
                <div className="flex justify-between items-center w-full">
                    <User
                        avatarProps={{
                            src: imageUrl
                        }}
                        name={
                            <div className="flex gap-1 text-sm items-center">
                                <div>{name}</div>
                            </div>
                        }
                        description={
                            truncateString(accountAddress)
                        }/>
                    <CheckboxIcon isSelected={activePrivateKey === key} className="w-3"/>
                </div>   
            </CardBody>
        </Card>
    )
}