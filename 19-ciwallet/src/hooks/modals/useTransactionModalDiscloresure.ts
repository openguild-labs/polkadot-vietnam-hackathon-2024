import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useTransactionModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useTransactionModalDisclosure = () : UseDisclosureReturn => {
    const { transactionModalDiscloresure } = useModals()
    return transactionModalDiscloresure
}
