"use client"
import { Container } from "@/components"
import { setConfirm, useAppDispatch, useAppSelector } from "@/redux"
import { ArrowLeftIcon } from "lucide-react"
import { Link, Spacer, Image, Button, Input } from "@nextui-org/react"
import React, { useEffect } from "react"
import {
    useBalance,
    useConfirmModalDisclosure,
    useRouterWithSearchParams,
    useTransferFormik,
    useTransferSelectTokenModalDisclosure,
} from "@/hooks"
import { BaseErrorName, truncateString } from "@/utils"
import { explorerUrl } from "@/services"
import { v4 } from "uuid"

const Page = () => {
    const router = useRouterWithSearchParams()
    const formik = useTransferFormik()
    const { onOpen } = useTransferSelectTokenModalDisclosure()
    const { onOpen: onConfirmModalDisclosureOpen } = useConfirmModalDisclosure()
    const dispatch = useAppDispatch()

    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )
    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const tokens = chains[preferenceChainKey].tokens
    const { name, imageUrl, symbol } = tokens[formik.values.tokenKey][network]

    const baseAccounts = useAppSelector((state) => state.authReducer.baseAccounts)
    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    const { accountAddress } = { ...baseAccounts[preferenceChainKey]?.accounts[activePrivateKey] }

    const { balanceSwr } = useBalance({
        chainKey: preferenceChainKey,
        tokenKey: formik.values.tokenKey,
        accountAddress,
    })

    const { data } = { ...balanceSwr }
    useEffect(() => {
        if (!data) return
        formik.setFieldValue("balance", data)
    }, [data])

    return (
        <Container hasPadding>
            <div className="flex flex-col gap-6 h-full">
                <div>
                    <div className="flex gap-2 items-center">
                        <Link
                            as="button"
                            onPress={() => router.back()}
                            color="foreground"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div className="text-2xl font-bold">Transfer</div>
                    </div>
                    <Spacer y={4} />
                    <div className="text-xs text-foreground-400">
              Transfer assets to recipient
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div>
                        <div>
                            <div className="text-sm">Select Token</div>
                            <Spacer y={1.5} />
                        </div>
                        <Button className="px-3 bg-content2" onPress={onOpen} fullWidth>
                            <div className="flex gap-2 items-center w-full">
                                <div className="flex gap-2 items-center">
                                    <Image className="w-5 h-5" src={imageUrl} />
                                    <div className="flex gap-1 items-center">
                                        <div>{name}</div>
                                        <div className="text-foreground-400">{symbol}</div>
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </div>
                    <Spacer y={4} />
                    <Input
                        id="amount"
                        label={`Amount (Max: ${data} ${symbol})`}
                        placeholder="Input transfer amount here"
                        labelPlacement="outside"
                        required
                        value={formik.values.amount.toString()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.amount && formik.errors.amount)}
                        errorMessage={formik.touched.amount && formik.errors.amount}
                        endContent={
                            <div className="text-sm text-foreground-400">{symbol}</div>
                        }
                    />
                    <Spacer y={4} />
                    <Input
                        id="recipientAddress"
                        label="Recipient"
                        placeholder="Input recipient address here"
                        labelPlacement="outside"
                        required
                        value={formik.values.recipientAddress.toString()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                            !!(
                                formik.touched.recipientAddress &&
                  formik.errors.recipientAddress
                            )
                        }
                        errorMessage={
                            formik.touched.recipientAddress &&
                formik.errors.recipientAddress
                        }
                    />
                </div>
                <Button
                    color="primary"
                    onPress={async () => {
                        dispatch(
                            setConfirm({
                                confirmMessage: (
                                    <div className="flex gap-2 items-center">
                                        <div className="flex gap-2 items-center">
                                            <div className="">Transfer</div>
                                            <div className="flex gap-1 items-center">
                                                <div>{formik.values.amount}</div>
                                                <Image className="w-5 h-5" src={imageUrl} />
                                                <div className="text-sm">{symbol}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div> to </div>
                                            <Link
                                                showAnchorIcon
                                                isExternal
                                                href={explorerUrl({
                                                    chainKey: preferenceChainKey,
                                                    value: formik.values.recipientAddress,
                                                    network,
                                                    type: "address",
                                                })}
                                                color="primary"
                                                size="sm"
                                            >
                                                {truncateString(
                                                    formik.values.recipientAddress
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                ),
                                processFn: async () => {
                                    try {
                                        await formik.submitForm()
                                    } catch (ex: unknown) {
                                        const _ex = ex as Error
                                        if (_ex.name === BaseErrorName.AtaNotFound) {
                                            console.error(_ex.message)
                                        }
                                    }
                                },
                                id: v4(),
                            })
                        )
                        onConfirmModalDisclosureOpen()
                    }}
                >
            Transfer
                </Button>
            </div>
        </Container>
    )
}

export default Page
