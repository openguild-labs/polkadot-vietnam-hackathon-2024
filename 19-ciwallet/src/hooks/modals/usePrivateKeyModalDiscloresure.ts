import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _usePrivateKeyModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const usePrivateKeyModalDisclosure = () : UseDisclosureReturn => {
    const { privateKeyModalDisclosure } = useModals()
    return privateKeyModalDisclosure
}



