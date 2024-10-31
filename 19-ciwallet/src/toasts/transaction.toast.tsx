import React from "react"
import toast from "react-hot-toast"
import { v4 } from "uuid"
import { WithClose } from "./with-close.toast"
import { Network } from "@/config"
import { Link } from "@nextui-org/react"
import { explorerUrl } from "@/services"
import { truncateString } from "@/utils"

export interface TriggerTransactionToastProps {
  txHash: string;
  network: Network;
  chainKey: string;
}

export const triggerTransactionToast = ({
    txHash,
    chainKey,
    network,
}: TriggerTransactionToastProps) => {
    const toastId = v4()
    toast.success(
        <WithClose toastId={toastId}>
            <div className="flex gap-2 items-center">
                <div>Tx Hash:</div>
                <Link
                    isExternal
                    href={explorerUrl({ chainKey, network, value: txHash, type: "tx" })}
                >
                    {truncateString(txHash)}
                </Link>
            </div>
        </WithClose>,
        {
            id: toastId,
        }
    )
}
