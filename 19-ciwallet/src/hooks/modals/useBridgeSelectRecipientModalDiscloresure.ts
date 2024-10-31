import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useBridgeSelectRecipientModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useBridgeSelectRecipientModalDisclosure = () : UseDisclosureReturn => {
    const { bridgeSelectRecipientModalDisclosure } = useModals()
    return bridgeSelectRecipientModalDisclosure
}



