"use client"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spacer,
    Chip,
} from "@nextui-org/react"
import React from "react"
import { useConfirmModalDisclosure } from "@/hooks"
import { TransactionType, useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

export const ConfirmModal = () => {
    const { isOpen, onClose } = useConfirmModalDisclosure()
    const confirm = useAppSelector((state) => state.miscellaneousReducer.confirm)
    const _type = confirm.type || TransactionType.Transfer
    const { trigger, isMutating } = useSWRMutation(
        ["PROCESS", confirm.id],
        confirm.processFn
    )

    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Confirm</ModalHeader>
                <ModalBody className="p-4">
                    <div>
                        <Chip variant="flat">{_type}</Chip>
                        <Spacer y={4} />
                        <div className="text-sm">{confirm.confirmMessage}</div>
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-2">
                    <Button color="primary" variant="bordered" onPress={onClose}>
            Cancel
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isMutating}
                        onPress={async () => {
                            await trigger()
                        }}
                    >
            Process
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
