"use client"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Snippet,
} from "@nextui-org/react"
import React from "react"
import { useMnemonicModalDisclosure } from "@/hooks"
import { useAppSelector } from "@/redux"
import { downloadTextFile } from "@/services"

export const MnemonicModal = () => {
    const { isOpen, onClose } = useMnemonicModalDisclosure()
    const mnemonic = useAppSelector((state) => state.authReducer.mnemonic)
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const chain = useAppSelector(
        (state) => state.blockchainReducer.chains[preferenceChainKey]
    )

    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Mnemonic</ModalHeader>
                <ModalBody className="p-4">
                    <div className="grid gap-4">
                        <div>
                            <Snippet
                                hideSymbol
                                classNames={{
                                    pre: "text-justify !whitespace-pre-line !line-clamp-5",
                                }}
                                codeString={mnemonic}
                                fullWidth
                            >
                                {mnemonic}
                            </Snippet>
                        </div>
                        <div>
                            <div className="text-xs text-warning text-justify">
                You can import the mnemonic into CiWallet, along with the
                Account Number above, to retrieve this wallet on {chain.name}.
                Make sure to remember the Account Number.
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-2">
                    <Button color="primary" variant="bordered" onPress={onClose}>
            Close
                    </Button>
                    <Button
                        onPress={() => downloadTextFile("mnemonic.txt", mnemonic)}
                        color="primary"
                    >
            Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
