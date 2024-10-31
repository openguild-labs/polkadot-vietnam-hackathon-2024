import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useBridgeSelectTokenModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useBridgeSelectTokenModalDisclosure = () : UseDisclosureReturn => {
    const { bridgeSelectTokenModalDisclosure } = useModals()
    return bridgeSelectTokenModalDisclosure
}



