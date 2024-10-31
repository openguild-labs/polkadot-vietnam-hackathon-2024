import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _usePolkadotTokenDetailsModalDiscloresure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const usePolkadotTokenDetailsModalDiscloresure = () : UseDisclosureReturn => {
    const { polkadotChainsModalDiscloresure } = useModals()
    return polkadotChainsModalDiscloresure
}



