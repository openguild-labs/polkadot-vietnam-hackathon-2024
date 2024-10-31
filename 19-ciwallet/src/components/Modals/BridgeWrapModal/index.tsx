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
import { useAppSelector } from "@/redux"
import {
    useBridgeWrapFormik,
    useBridgeWrapModalDisclosure,
} from "@/hooks"
import { valuesWithKey } from "@/utils"

export const BridgeWrapModal = () => {
    const { isOpen, onClose } = useBridgeWrapModalDisclosure()
    const formik = useBridgeWrapFormik()

    const chains = valuesWithKey(
        useAppSelector((state) => state.blockchainReducer.chains)
    )
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const wrappedTokens = useAppSelector(
        (state) => state.resultReducer.bridge.wrappedTokens
    )
    
    return (
        <Modal hideCloseButton isOpen={isOpen}>
            <ModalContent>
                <form
                    className="w-full h-full"
                    onSubmit={formik.handleSubmit}
                    onReset={formik.handleReset}
                >
                    <ModalHeader className="p-4 pb-2 font-bold">
            Wrap Token
                    </ModalHeader>
                    <ModalBody className="p-4">
                        <Card>
                            <CardBody className="p-0">
                                <div>
                                    {chains
                                        .filter((chain) => chain.key !== preferenceChainKey)
                                        .filter(
                                            (chain) =>
                                                !Object.values(wrappedTokens)
                                                    .map((wrappedToken) => wrappedToken.key)
                                                    .includes(chain.key)
                                        )
                                        .map(({ imageUrl, key, name }, index) => (
                                            <div key={key}>
                                                <Card
                                                    disableRipple
                                                    radius="none"
                                                    shadow="none"
                                                    fullWidth
                                                    isPressable
                                                    onPress={() => formik.setFieldValue("targetChainKey", key)}
                                                >
                                                    <CardBody className="px-3 py-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex gap-2 items-center">
                                                                <Image className="w-5 h-5" src={imageUrl} />
                                                                {name}
                                                            </div>
                                                            <CheckboxIcon
                                                                isSelected={key === formik.values.targetChainKey}
                                                                className="w-3"
                                                            />
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                                {index !== chains.length - 1 && <Divider />}
                                            </div>
                                        ))}
                                </div>
                            </CardBody>
                        </Card>
                    </ModalBody>
                    <ModalFooter className="p-4 pt-2">
                        <Button
                            color="primary"
                            variant="bordered"
                            onPress={onClose}
                        >
              Close
                        </Button>
                        <Button
                            color="primary"
                            isLoading={formik.isSubmitting}
                            onPress={async () => {
                                await formik.submitForm()
                                onClose()
                            }}
                        >
              Wrap
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}
