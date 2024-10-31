import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useAccountsModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useAccountsModalDisclosure = () : UseDisclosureReturn => {
    const { accountsModalDisclosure } = useModals()
    return accountsModalDisclosure
}



