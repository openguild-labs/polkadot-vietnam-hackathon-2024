"use client"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { Link } from "@nextui-org/react"
import React, { useState } from "react"

export const BalanceSummaryInUSD = () => {
    const [isVisible, setIsVisible] = useState(false)


    return (
        <div className="flex gap-2 items-center">
            <div className="text-4xl font-bold">{isVisible ? "$0.00" : "****"}</div> 
            <Link type="button" color="foreground" as="button" onPress={() => setIsVisible(!isVisible)}>
                {
                    !isVisible ?
                        <EyeIcon className="w-5 h-5"/>
                        : <EyeSlashIcon className="w-5 h-5"/>
                }</Link>
        </div>
    )
}