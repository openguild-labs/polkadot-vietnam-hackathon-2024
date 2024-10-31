import { XMarkIcon } from "@heroicons/react/24/outline"
import { Link } from "@nextui-org/react"
import React, { PropsWithChildren } from "react"
import toast from "react-hot-toast"

export interface WithCloseProps extends PropsWithChildren {
    toastId: string
}

export const WithClose = ({ toastId, children} : WithCloseProps) => {
    return (
        <div className="flex justify-between items-center gap-4">
            {children}
            <Link color="foreground" as="button" onPress={() => toast.dismiss(toastId)}>
                <XMarkIcon className="w-5 h-5" />
            </Link>
        </div>
    )
}