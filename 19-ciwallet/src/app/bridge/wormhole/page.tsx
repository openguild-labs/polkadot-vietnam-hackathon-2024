"use client"
import { Tabs, Tab, Spacer, Link } from "@nextui-org/react"
import {
    BridgeTab,
    switchBridgeTab,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import React from "react"
import { TransferTab } from "./TransferTab"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Container } from "@/components"
import { WrapTab } from "./WrapTab"
import { RedeemTab } from "./RedeemTab"
import { useRouterWithSearchParams } from "@/hooks"

const Page = () => {
    const bridgeTab = useAppSelector((state) => state.tabReducer.bridgeTab)
    const dispatch = useAppDispatch()
    const router = useRouterWithSearchParams()
    
    return (
        <Container hasPadding>
            <div className="flex flex-col gap-6 ">
                <div>
                    <div className="flex gap-2 items-center">
                        <Link as="button" onPress={() => router.back()} color="foreground">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div className="text-2xl font-bold">Wormhole</div>
                    </div>
                    <Spacer y={4} />
                    <div className="text-xs text-foreground-400">
            Transfer assets between chains via Wormhole
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <Tabs
                        aria-label="Bridge"
                        selectedKey={bridgeTab}
                        onSelectionChange={(tab) => {
                            dispatch(switchBridgeTab(tab as BridgeTab))
                        }}
                        classNames={{
                            panel: "p-0 flex-1 mt-6",
                            tabList: "w-full",
                        }}
                    >
                        <Tab key={BridgeTab.Transfer} title="Transfer">
                            <TransferTab />
                        </Tab>
                        <Tab key={BridgeTab.Wrap} title="Wrap">
                            <WrapTab />
                        </Tab>
                        <Tab key={BridgeTab.Redeem} title="Redeem">
                            <RedeemTab />
                        </Tab>
                    </Tabs>
                </div>   
            </div>
        </Container>
    )
}

export default Page