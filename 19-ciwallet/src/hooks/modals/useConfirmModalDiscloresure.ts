import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useConfirmModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useConfirmModalDisclosure = () : UseDisclosureReturn => {
    const { confirmModalDiscloresure } = useModals()
    return confirmModalDiscloresure
}
