"use client"

import React from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react"
import { useBridgeRedeemResultModalDiscloresure } from "@/hooks"
import { useAppSelector } from "@/redux"
import { valuesWithKey } from "@/utils"
import { defaultSecondaryChainKey } from "@/config"
import { deserialize, VAA } from "@wormhole-foundation/sdk"
import { TxHash } from "@/components/TxHash"

export const BridgeRedeemResultModal = () => {
    const { isOpen, onClose } =
    useBridgeRedeemResultModalDiscloresure()
    
    const result = useAppSelector(state => state.resultReducer.bridge.redeem)
    const { vaa, txHash } = { ...result }

    let deserializedVaa: VAA<"TokenBridge:Transfer"> | undefined
    if (vaa) {
        deserializedVaa = deserialize<"TokenBridge:Transfer">("TokenBridge:Transfer", Uint8Array.from(Buffer.from(vaa.serializedVaa, "base64")))
    }
    const chains = useAppSelector(state => state.blockchainReducer.chains)
    const targetChain = valuesWithKey(chains).find(({ wormhole }) => wormhole?.chain === deserializedVaa?.payload.to.chain)
    
    return (
        <Modal hideCloseButton isOpen={isOpen}>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Redeem Result</ModalHeader>
                <ModalBody className="p-4">
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm">Tx Hash</div>
                            <TxHash bridgeProtocolKey={vaa?.bridgeProtocolKey ?? ""} chainKey={targetChain?.key ?? defaultSecondaryChainKey} txHash={txHash ?? ""} />
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
