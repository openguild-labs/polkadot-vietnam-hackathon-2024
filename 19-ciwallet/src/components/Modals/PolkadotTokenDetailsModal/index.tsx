"use client"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react"
import React from "react"
import {
    usePolkadotBalances,
    usePolkadotTokenDetailsModalDiscloresure,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import { nativeTokenKey, PolkadotChainKey } from "@/config"
import { valuesWithKey } from "@/utils"
import { Chain } from "./Chain"

//polkadot token details
export const PolkadotTokenDetailsModal = () => {
    const { isOpen, onClose } = usePolkadotTokenDetailsModalDiscloresure()
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const baseAccounts = useAppSelector(
        (state) => state.authReducer.baseAccounts
    )
    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    const accountAddress =
    baseAccounts[preferenceChainKey]?.accounts[activePrivateKey]
        ?.accountAddress

    const { balances } = usePolkadotBalances({
        address: accountAddress,
        tokenKey: nativeTokenKey,
        forceReloadWhenOpenModal: true,
    })

    const polkadotChains = useAppSelector(
        (state) => state.blockchainReducer.polkadotChains
    )

    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Token Details</ModalHeader>
                <ModalBody className="p-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            {valuesWithKey(polkadotChains).map((chain) => (
                                <Chain
                                    balance={balances[chain.key as PolkadotChainKey]}
                                    key={chain.key}
                                    chain={chain}
                                />
                            ))}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-2">
                    <Button color="primary" variant="bordered" onPress={onClose}>
            Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
