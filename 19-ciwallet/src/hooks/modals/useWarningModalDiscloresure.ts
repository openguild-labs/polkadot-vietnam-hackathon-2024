import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useWarningModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useWarningModalDisclosure = () : UseDisclosureReturn => {
    const { warningModalDiscloresure } = useModals()
    return warningModalDiscloresure
}
