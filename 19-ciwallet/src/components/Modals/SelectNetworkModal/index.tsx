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
import { setPreferenceChainKey, useAppDispatch, useAppSelector } from "@/redux"
import { useSelectNetworkModalDisclosure } from "@/hooks"
import { valuesWithKey } from "@/utils"

export const SelectNetworkModal = () => {
    const { isOpen, onClose } =
    useSelectNetworkModalDisclosure()

    const dispatch = useAppDispatch()

    const chains = valuesWithKey(useAppSelector(state => state.blockchainReducer.chains))
    const preferenceChainKey = useAppSelector(state => state.blockchainReducer.preferenceChainKey)

    return (
        <Modal hideCloseButton isOpen={isOpen}>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Select Network</ModalHeader>
                <ModalBody className="p-4">
                    <Card>
                        <CardBody className="p-0">
                            <div>
                                {chains.map(({ imageUrl, key, name }, index) => (
                                    <div key={key}>
                                        <Card
                                            disableRipple
                                            radius="none"
                                            shadow="none"
                                            fullWidth
                                            isPressable
                                            onPress={() => dispatch(setPreferenceChainKey(key))}
                                        >
                                            <CardBody className="px-3 py-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-2 items-center">
                                                        <Image className="w-5 h-5" src={imageUrl} />
                                                        {name}
                                                    </div>
                                                    <CheckboxIcon isSelected={key === preferenceChainKey} className="w-3"/>
                                                </div>             
                                            </CardBody>
                                        </Card>
                                        {
                                            index !== chains.length - 1 && <Divider />
                                        }
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
