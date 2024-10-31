import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useBridgeTransferResultModalDiscloresure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useBridgeTransferResultModalDiscloresure = () : UseDisclosureReturn => {
    const { bridgeTransferResultModalDisclosure } = useModals()
    return bridgeTransferResultModalDisclosure
}