import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useMnemonicModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useMnemonicModalDisclosure = () : UseDisclosureReturn => {
    const { mnemonicModalDisclosure } = useModals()
    return mnemonicModalDisclosure
}



