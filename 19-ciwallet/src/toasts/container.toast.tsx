"use client"
import React from "react"
import { Toaster } from "react-hot-toast"
import { TOAST_DURATION, TOAST_ERROR_COLOR, TOAST_SUCCESS_COLOR } from "./config.toast"
import { useTheme } from "next-themes"

export const ToastContainer = () => {
    const { theme } = useTheme()
    const secondaryColor = theme === "dark" ? "000" : "#fff"
    return (
        <Toaster position="bottom-center"
            toastOptions={{
                duration: TOAST_DURATION,
                success: {
                    iconTheme: {
                        primary: TOAST_SUCCESS_COLOR,
                        secondary: secondaryColor,
                    }
                },
                error: {
                    iconTheme: {
                        primary: TOAST_ERROR_COLOR,
                        secondary: secondaryColor,
                    }}
            }}
        />
    )
}