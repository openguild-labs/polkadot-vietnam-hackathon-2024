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
import { usePrivateKeyModalDisclosure } from "@/hooks"
import { useAppSelector } from "@/redux"
import { downloadTextFile } from "@/services"
import { SupportedChainKey } from "@/config"

export const PrivateKeyModal = () => {
    const { isOpen, onClose } = usePrivateKeyModalDisclosure()
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const baseAccounts = useAppSelector(
        (state) => state.authReducer.baseAccounts
    )
    const privateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    
    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Private Key</ModalHeader>
                <ModalBody className="p-4">
                    <div className="grid gap-4">
                        <Snippet
                            hideSymbol
                            classNames={{
                                pre: 
                                preferenceChainKey === SupportedChainKey.Algorand ?
                                    "text-justify !whitespace-pre-line !line-clamp-5" :
                                    "text-justify !break-all !whitespace-pre-line !line-clamp-5",
                            }}
                            codeString={privateKey}
                            fullWidth
                        >
                            {privateKey}
                        </Snippet>
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-2">
                    <Button color="primary" variant="bordered" onPress={onClose}>
            Close
                    </Button>
                    <Button
                        onPress={() => downloadTextFile("private-key.txt", privateKey)}
                        color="primary"
                    >
            Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
