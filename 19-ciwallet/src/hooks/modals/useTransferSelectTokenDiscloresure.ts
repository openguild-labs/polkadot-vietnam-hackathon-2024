import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useTransferSelectTokenModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useTransferSelectTokenModalDisclosure = () : UseDisclosureReturn => {
    const { transferSelectTokenModalDiscloresure } = useModals()
    return transferSelectTokenModalDiscloresure
}
