import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useErrorModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useErrorModalDisclosure = () : UseDisclosureReturn => {
    const { errorModalDisclosure } = useModals()
    return errorModalDisclosure
}



