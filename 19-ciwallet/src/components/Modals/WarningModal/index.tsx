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
import { useWarningModalDisclosure } from "@/hooks"
import { useAppSelector } from "@/redux"

export const WarningModal = () => {
    const { isOpen, onClose } = useWarningModalDisclosure()
    const { processFn, warningMessage } =
    useAppSelector((state) => state.miscellaneousReducer.warning)

    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Warning</ModalHeader>
                <ModalBody className="p-4">
                    <div className="text-sm">
                        {warningMessage}
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-2">
                    <Button color="danger" variant="bordered" onPress={onClose}>
            Cancel
                    </Button>
                    <Button color="danger" onPress={async () => {
                        await processFn()
                        onClose()
                    }}>
            Process
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
