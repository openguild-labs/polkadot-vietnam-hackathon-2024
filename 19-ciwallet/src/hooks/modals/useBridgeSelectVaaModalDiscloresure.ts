import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useBridgeSelectVaaModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useBridgeSelectVaaModalDisclosure = () : UseDisclosureReturn => {
    const { bridgeSelectVaaModalDisclosure } = useModals()
    return bridgeSelectVaaModalDisclosure
}



