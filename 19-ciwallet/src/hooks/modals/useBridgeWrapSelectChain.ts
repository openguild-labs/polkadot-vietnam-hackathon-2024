import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useBridgeWrapModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useBridgeWrapModalDisclosure = () : UseDisclosureReturn => {
    const { bridgeWrapModalDisclosure } = useModals()
    return bridgeWrapModalDisclosure
}
