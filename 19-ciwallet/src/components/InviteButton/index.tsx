"use client"

import { useInviteModalDisclosure } from "@/hooks"
import { Button } from "@nextui-org/react"
import React from "react"

export const InviteButton = () => {
    const { onOpen } = useInviteModalDisclosure()
    return (
        <Button onPress={onOpen} color="primary">
            Invite
        </Button>
    )
}