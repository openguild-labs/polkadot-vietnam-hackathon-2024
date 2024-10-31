import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useCreateAccountModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useCreateAccountModalDisclosure = () : UseDisclosureReturn => {
    const { createAccountModalDisclosure } = useModals()
    return createAccountModalDisclosure
}



