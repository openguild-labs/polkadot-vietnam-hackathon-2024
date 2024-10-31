"use client"

import React from "react"
import { Switch } from "@nextui-org/react"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { useTheme } from "next-themes"

export const DarkModeSwitch = () => {
    const { theme, setTheme } = useTheme()

    return (
        <Switch color="default" size="lg" classNames={{
            thumbIcon: "w-5 h-5"
        }} isSelected={theme === "dark"} onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
        thumbIcon={({ isSelected, className }) =>
            isSelected ? (
                <SunIcon className={className} />
            ) : (
                <MoonIcon className={className} />
            )
        }
        />
    )
}