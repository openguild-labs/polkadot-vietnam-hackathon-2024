"use client"

import React from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Divider,
    Card,
    CardBody,
} from "@nextui-org/react"
import {
    useBridgeTransferFormik,
    useBridgeSelectRecipientModalDisclosure,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import { BridgeAccountUser } from "./BridgeAccountUser"
import { valuesWithKey } from "@/utils"

export const BridgeSelectRecipientModal = () => {
    const { isOpen, onClose } = useBridgeSelectRecipientModalDisclosure()
    const formik = useBridgeTransferFormik()

    const baseAccounts = useAppSelector(state => state.authReducer.baseAccounts)
    const accounts = baseAccounts[formik.values.targetChainKey]?.accounts
    const _accounts = valuesWithKey(accounts ?? {})

    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Select Recipient</ModalHeader>
                <ModalBody className="p-4">
                    <Card>
                        <CardBody className="p-0">
                            <div>
                                {_accounts.map((account, index) => (
                                    <div key={account.name}>
                                        <BridgeAccountUser
                                            account={account}
                                            activePrivateKey={formik.values.targetPrivateKey}
                                            targetChainKey={formik.values.targetChainKey}
                                        />
                                        {index !== _accounts.length - 1 && <Divider />}
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
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
