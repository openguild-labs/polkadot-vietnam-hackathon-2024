import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useBridgeRedeemResultModalDiscloresure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useBridgeRedeemResultModalDiscloresure = () : UseDisclosureReturn => {
    const { bridgeRedeemResultModalDisclosure } = useModals()
    return bridgeRedeemResultModalDisclosure
}