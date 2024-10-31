import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useSelectNetworkModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useSelectNetworkModalDisclosure = () : UseDisclosureReturn => {
    const { selectNetworkModalDiscloresure } = useModals()
    return selectNetworkModalDiscloresure
}
