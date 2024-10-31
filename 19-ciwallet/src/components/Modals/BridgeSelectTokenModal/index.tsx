"use client"

import React from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    Image,
    Divider,
    CheckboxIcon,
} from "@nextui-org/react"
import {
    useBridgeTransferFormik,
    useBridgeSelectTokenModalDisclosure,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import { valuesWithKey } from "@/utils"

export const BridgeSelectTokenModal = () => {
    const { isOpen, onClose } = useBridgeSelectTokenModalDisclosure()
    const formik = useBridgeTransferFormik()

    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const tokens = useAppSelector(
        (state) => state.blockchainReducer.chains[preferenceChainKey].tokens
    )
    const network = useAppSelector((state) => state.blockchainReducer.network)
    return (
        <Modal hideCloseButton isOpen={isOpen}>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Select Token</ModalHeader>
                <ModalBody className="p-4">
                    <Card>
                        <CardBody className="p-0">
                            <div>
                                {valuesWithKey(tokens).map(
                                    (token, index) => {
                                        return (
                                            <div key={token.key}>
                                                <Card
                                                    disableRipple
                                                    radius="none"
                                                    shadow="none"
                                                    fullWidth
                                                    isPressable
                                                    onPress={() => formik.setFieldValue("tokenKey", token.key)}
                                                >
                                                    <CardBody className="px-3 py-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex gap-2 items-center">
                                                                <Image className="w-5 h-5" src={token[network].imageUrl} />
                                                                <div className="flex gap-1 items-center">
                                                                    <div>{token[network].name}</div>
                                                                    <div className="text-foreground-400">
                                                                        {token[network].symbol}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {formik.values.tokenKey === token.key && (
                                                                <CheckboxIcon isSelected className="w-3" />
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                                {index !== Object.values(tokens).length - 1 && (
                                                    <Divider />
                                                )}
                                            </div>
                                        )
                                    }
                                )}
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
