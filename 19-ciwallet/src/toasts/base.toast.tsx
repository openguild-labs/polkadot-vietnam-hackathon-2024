import { toast } from "react-hot-toast"
import { v4 } from "uuid"
import React from "react"
import { WithClose } from "./with-close.toast"

export const triggerSuccessToast = (message: string) => {
    const toastId = v4()
    toast.success(
        <WithClose toastId={toastId}>
            <div className="text-sm">{message}</div>
        </WithClose>,
        {
            id: toastId,
        }
    )
}

export const triggerErrorToast = (message: string) => {
    const toastId = v4()
    toast.error(
        <WithClose toastId={toastId}>
            <div className="text-sm">{message}</div>
        </WithClose>,
        {
            id: toastId,
        }
    )
}