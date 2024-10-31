"use client"

import React, { PropsWithChildren, Suspense } from "react"
import { NextUIProvider, Spinner } from "@nextui-org/react"
import { HooksProvider } from "@/hooks"
import { Provider as ReduxProvider } from "react-redux"
import { store, useAppSelector } from "@/redux"
import { Container, Modals } from "@/components"
import { TestProvider } from "@/tests"
import { ToastContainer } from "@/toasts"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export const LayoutContent = ({ children }: PropsWithChildren) => {
    const initialized = useAppSelector((state) => state.authReducer.initialized)
    return (
        <Suspense>
            <NextThemesProvider attribute="class" enableSystem>
                <HooksProvider>
                    {initialized ? (
                        children
                    ) : (
                        <Container centerContent>
                            <Spinner size="lg" label="Loading..." />
                        </Container>
                    )}
                    <Modals />
                    <ToastContainer />
                </HooksProvider>
            </NextThemesProvider>
        </Suspense>
    )
}

export const WrappedLayout = ({ children }: PropsWithChildren) => {
    return (
        <TestProvider isTesting={false}>
            <NextUIProvider>
                <ReduxProvider store={store}>
                    <LayoutContent> {children} </LayoutContent>
                </ReduxProvider>
            </NextUIProvider>
        </TestProvider>
    )
}
