import { useDisclosure } from "@nextui-org/react"
import { UseDisclosureReturn } from "@nextui-org/use-disclosure"
import { useModals } from "."

export const _useInviteModalDisclosure = () : UseDisclosureReturn => {
    return useDisclosure()
}

export const useInviteModalDisclosure = () : UseDisclosureReturn => {
    const { inviteModalDisclosure } = useModals()
    return inviteModalDisclosure
}



