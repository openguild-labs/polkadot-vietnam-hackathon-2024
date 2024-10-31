"use client"

import React from "react"
import { BalanceSummaryInUSD, Container } from "@/components"
import {
    Card,
    CardBody,
    User,
    Image,
    Button,
    Link,
    Spacer,
    Tooltip,
    Snippet,
    Tabs,
    Tab,
} from "@nextui-org/react"
import {
    useSelectNetworkModalDisclosure,
    useAccountsModalDisclosure,
    useRouterWithSearchParams,
} from "@/hooks"
import { constantConfig } from "@/config"
import {
    AssetsTab,
    switchAssetsTab,
    triggerRefreshBalance,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    BellIcon,
    Cog6ToothIcon,
    PaperAirplaneIcon,
    PlusIcon,
    QrCodeIcon,
} from "@heroicons/react/24/outline"
import { RefreshCcwIcon, SendToBackIcon } from "lucide-react"
import { truncateString } from "@/utils"
import { Tokens } from "./Tokens"
import { NFTs } from "./NFTs"

const Page = () => {
    const { onOpen } = useAccountsModalDisclosure()
    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const router = useRouterWithSearchParams()

    const baseAccounts = useAppSelector((state) => state.authReducer.baseAccounts)
    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    const account = baseAccounts[preferenceChainKey]?.accounts[activePrivateKey]
    const { name, imageUrl, accountAddress } = { ...account }
    const assetsTab = useAppSelector((state) => state.tabReducer.assetsTab)

    const { onOpen: onSelectNetworkModalOpen } =
    useSelectNetworkModalDisclosure()

    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const dispatch = useAppDispatch()

    return (
        <Container hasPadding>
            <div>
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <Snippet
                            hideSymbol
                            classNames={{
                                base: "p-0 bg-inhenrit",
                                pre: "font-inherit",
                            }}
                            size="sm"
                            codeString={accountAddress}
                        >
                            <Card disableRipple isPressable onPress={onOpen} shadow="none">
                                <CardBody className="p-0">
                                    <User
                                        avatarProps={{
                                            src: imageUrl,
                                        }}
                                        name={
                                            <div className="flex gap-1 text-sm items-center">
                                                <div>{name}</div>
                                            </div>
                                        }
                                        description={truncateString(accountAddress ?? "")}
                                    />
                                </CardBody>
                            </Card>
                        </Snippet>
                        <div className="flex gap-2 items-center">
                            <Link
                                as="button"
                                onPress={() => router.push(constantConfig().path.settings)}
                                color="foreground"
                            >
                                <Cog6ToothIcon className="w-5 h-5" />
                            </Link>
                            <Link as="button" color="foreground">
                                <BellIcon className="w-5 h-5" />
                            </Link>
                            <Button
                                onPress={onSelectNetworkModalOpen}
                                isIconOnly
                                variant="flat"
                            >
                                <Image
                                    className="w-5 h-5"
                                    src={chains[preferenceChainKey].imageUrl}
                                />
                            </Button>
                        </div>
                    </div>
                    <Spacer y={6} />
                    <BalanceSummaryInUSD />
                    <Spacer y={6} />
                    <div className="flex gap-2">
                        <Tooltip content="Transfer">
                            <Button
                                onPress={() => router.push(constantConfig().path.transfer)}
                                variant="flat"
                                isIconOnly
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Bridge">
                            <Button
                                onPress={() => router.push(constantConfig().path.bridge)}
                                variant="flat"
                                isIconOnly
                            >
                                <SendToBackIcon strokeWidth={1.5} className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Receive">
                            <Button variant="flat" isIconOnly>
                                <QrCodeIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <Spacer y={6} />
                <div>
                    <Link
                        onPress={() => router.push(constantConfig().path["cifarm-pre"])}
                        as="button"
                        className="flex"
                    >
                        <Image removeWrapper src="/icons/cifarm.png" className="w-16 h-16" />
                    </Link>
                </div>
                <Spacer y={6} />
                <div className="flex items-center justify-between">
                    <Tabs
                        selectedKey={assetsTab}
                        onSelectionChange={(key) =>
                            dispatch(switchAssetsTab(key as AssetsTab))
                        }
                    >
                        <Tab title="Tokens" key={AssetsTab.Tokens} />
                        <Tab title="NFTs" key={AssetsTab.NFTs} />
                    </Tabs>
                    <div className="flex gap-2">
                        <Link as="button" onPress={() => dispatch(triggerRefreshBalance())}>
                            <RefreshCcwIcon strokeWidth={1.5} className="w-5 h-5" />
                        </Link>
                        <Link as="button">
                            <PlusIcon className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                <Spacer y={4} />
                {assetsTab === AssetsTab.Tokens ? <Tokens /> : <NFTs />}
            </div>
        </Container>
    )
}

export default Page
