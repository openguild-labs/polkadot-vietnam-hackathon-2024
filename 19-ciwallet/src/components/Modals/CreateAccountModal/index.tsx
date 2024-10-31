"use client"

import React from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Tabs,
    Tab,
} from "@nextui-org/react"
import { useCreateAccountModalDisclosure } from "@/hooks"
import { CreateAccountTab, switchCreateAccountTab, useAppDispatch, useAppSelector } from "@/redux"
import { GenerateTab } from "./GenerateTab"
import { ImportTab } from "./ImportTab"

export const CreateAccountModal = () => {
    const { isOpen } = useCreateAccountModalDisclosure()
   
    const createAccountTab = useAppSelector((state) => state.tabReducer.createAccountTab)
    const dispatch = useAppDispatch()

    return (
        <Modal isOpen={isOpen} hideCloseButton>
            <ModalContent>
                <ModalHeader className="p-4 pb-2 font-bold">Create Account</ModalHeader>
                <ModalBody className="p-4">
                    <Tabs
                        aria-label="Bridge"
                        selectedKey={createAccountTab}
                        onSelectionChange={(tab) => {
                            dispatch(switchCreateAccountTab(tab as CreateAccountTab))
                        }}
                        classNames={{
                            panel: "p-0 flex-1",
                            tabList: "w-full",
                        }}
                    >
                        <Tab key={CreateAccountTab.Generate} title="Generate">
                            <GenerateTab />
                        </Tab>
                        <Tab key={CreateAccountTab.Import} title="Import">
                            <ImportTab />
                        </Tab>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
