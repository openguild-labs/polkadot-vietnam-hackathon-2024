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
    Link,
} from "@nextui-org/react"
import {
    useAccountsModalDisclosure,
    useCreateAccountModalDisclosure,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import { AccountUser } from "../../AccountUser"
import { PlusIcon } from "@heroicons/react/24/outline"
import { valuesWithKey } from "@/utils"

export const AccountsModal = () => {
    const { isOpen, onClose } = useAccountsModalDisclosure()
    const { onOpen: onCreateAccountModalOpen } =
    useCreateAccountModalDisclosure()

    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const baseAccounts = useAppSelector(state => state.authReducer.baseAccounts)

    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    const accounts = baseAccounts[preferenceChainKey]?.accounts

    const _accounts = valuesWithKey(accounts ?? {})

    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Accounts</ModalHeader>
                <ModalBody className="p-4">
                    <Card>
                        <CardBody className="p-0">
                            <div>
                                {_accounts.map((account, index) => (
                                    <div key={account.name}>
                                        <AccountUser
                                            account={account}
                                            activePrivateKey={activePrivateKey}
                                        />
                                        {index !== _accounts.length - 1 && <Divider />}
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                    <Link
                        as="button"
                        onPress={async () => {
                            onCreateAccountModalOpen()
                        }}
                        size="sm"
                        color="primary"
                    >
                        <div className="flex gap-1 items-center">
                            <PlusIcon className="w-5 h-5" />
                            <div>Create Account</div>
                        </div>
                    </Link>
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
