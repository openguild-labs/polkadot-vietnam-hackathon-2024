"use client"
import { defaultChainKey, defaultSecondaryChainKey, nativeTokenKey, SupportedBridgeProtocolKey } from "@/config"
import {
    useBridgeTransferFormik,
    useBridgeSelectRecipientModalDisclosure,
    useBridgeSelectTokenModalDisclosure,
    useBalance,
    useConfirmModalDisclosure,
    useBridgeTransferResultModalDiscloresure,
    useErrorModalDisclosure,
} from "@/hooks"
import {
    Input,
    Spacer,
    Image,
    Button,
    Select,
    SelectItem,
    Link,
} from "@nextui-org/react"
import {
    setConfirm,
    setError,
    TransactionType,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import React, { useEffect } from "react"
import { explorerUrl } from "@/services"
import { BaseErrorName, replace, truncateString, valuesWithKey } from "@/utils"
import { v4 } from "uuid"

export const TransferTab = () => {
    const formik = useBridgeTransferFormik()
    
    const { onOpen } = useBridgeSelectTokenModalDisclosure()
    const { onOpen: onBridgeSelectRecipientModalDisclosureOpen } =
    useBridgeSelectRecipientModalDisclosure()
    const { onOpen: onBridgeTransferResultModalDiscloresureOpen } =
    useBridgeTransferResultModalDiscloresure()
    const { onOpen: onErrorModalDisclosureOpen } = useErrorModalDisclosure()

    const preferenceChainKey = useAppSelector(
        (state) => state.blockchainReducer.preferenceChainKey
    )

    const chains = useAppSelector((state) => state.blockchainReducer.chains)

    const tokens = chains[preferenceChainKey].tokens
    const token = tokens[formik.values.tokenKey]
    const network = useAppSelector((state) => state.blockchainReducer.network)

    const { imageUrl, name, symbol } = { ...token[network] }

    const baseAccounts = useAppSelector(
        (state) => state.authReducer.baseAccounts
    )
    const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
    const { accountAddress } = {
        ...baseAccounts[preferenceChainKey]?.accounts[activePrivateKey],
    }

    const { balanceSwr } = useBalance({
        chainKey: preferenceChainKey,
        tokenKey: formik.values.tokenKey,
        accountAddress,
    })
    const { data } = { ...balanceSwr }
    useEffect(() => {
        if (data === undefined) return
        formik.setFieldValue("balance", data)
    }, [data])

    const _differenceChainKey = preferenceChainKey === defaultChainKey ? defaultSecondaryChainKey : defaultChainKey
    useEffect(() => {
        if (preferenceChainKey === formik.values.targetChainKey) {
            formik.setFieldValue("targetChainKey", _differenceChainKey)
        }
    }, [preferenceChainKey])

    const crosschain = useAppSelector(state => state.blockchainReducer.crosschain)
    const bridgeProtocols = crosschain[preferenceChainKey][formik.values.targetChainKey] ?? {} 

    useEffect(() => {
        if (formik.values.tokenKey === nativeTokenKey) {
            formik.setFieldValue(
                "nativeAmountPlusFee",
                Number(formik.values.amount) + (bridgeProtocols[SupportedBridgeProtocolKey.Wormhole]?.minimalFee ?? 0)
            )
        } else {
            formik.setFieldValue(
                "nativeAmountPlusFee",
                bridgeProtocols[0].minimalFee
            )
        }
    }, [formik.values.tokenKey, formik.values.amount])

    const { onOpen: onConfirmModalDisclosureOpen } = useConfirmModalDisclosure()

    const dispatch = useAppDispatch()

    useEffect(() => {
    //havent load
        if (!baseAccounts[formik.values.targetChainKey]) return
        formik.setFieldValue(
            "targetAddress",
            valuesWithKey(baseAccounts[formik.values.targetChainKey].accounts)[0]
                .accountAddress
        )
    }, [baseAccounts])

    return (
        <div className="w-full min-h-full flex flex-col gap-6 justify-between">
            <div>
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
                />
                <Spacer y={4} />
                <Select
                    startContent={
                        <Image
                            removeWrapper
                            className="w-5 h-5"
                            src={chains[formik.values.targetChainKey]?.imageUrl}
                        />
                    }
                    label="Select Target Chain"
                    labelPlacement="outside"
                    selectedKeys={[formik.values.targetChainKey]}
                    onSelectionChange={(keys) => {
                        const currentKey = keys.currentKey
                        if (!currentKey) return
                        const selectedChainKey = currentKey ?? defaultChainKey
                        formik.setFieldValue("targetChainKey", selectedChainKey)
                    }}
                >
                    {valuesWithKey(chains)
                        .filter(({ key }) => key !== preferenceChainKey)
                        .map(({ key, name, imageUrl }) => (
                            <SelectItem
                                startContent={<Image className="w-5 h-5" src={imageUrl} />}
                                key={key}
                                value={key}
                            >
                                {name}
                            </SelectItem>
                        ))}
                </Select>
                <Spacer y={4} />
                <div>
                    <div className="text-sm">Select Recipient</div>
                    <Spacer y={1.5} />
                    <Button
                        className="px-3 bg-content2 justify-start"
                        fullWidth
                        onPress={onBridgeSelectRecipientModalDisclosureOpen}
                    >
                        {formik.values.targetAddress
                            ? truncateString(formik.values.targetAddress)
                            : ""}
                    </Button>
                </div>
            </div>
            <div>
                <Button
                    isDisabled={!formik.isValid}
                    color="primary"
                    fullWidth
                    onPress={async () => {
                        dispatch(
                            setConfirm({
                                type: TransactionType.BridgeTransfer,
                                confirmMessage: (
                                    <div className="grid gap-2">
                                        <div className="flex gap-2 items-center">
                                            <div className="w-[80px]">Transfer</div>
                                            <div className="flex gap-1 items-center">
                                                <div>{formik.values.amount}</div>
                                                <Image
                                                    removeWrapper
                                                    className="w-5 h-5"
                                                    src={imageUrl}
                                                />
                                                <div className="text-sm">{symbol}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-[80px]">Path</div>
                                            <div className="flex gap-1 items-center">
                                                <Image
                                                    removeWrapper
                                                    className="w-5 h-5"
                                                    src={chains[preferenceChainKey].imageUrl}
                                                />
                                                <div className="text-sm">
                                                    {chains[preferenceChainKey].name}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">to</div>
                                            <div className="flex gap-1 items-center">
                                                <Image
                                                    removeWrapper
                                                    className="w-5 h-5"
                                                    src={chains[formik.values.targetChainKey].imageUrl}
                                                />
                                                <div className="text-sm">
                                                    {chains[formik.values.targetChainKey].name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-[80px]">Protocol</div>
                                            <div className="flex gap-1 items-center">
                                                <Image
                                                    removeWrapper
                                                    className="w-5 h-5"
                                                    src={
                                                        bridgeProtocols[SupportedBridgeProtocolKey.Wormhole].imageUrl
                                                    }
                                                />
                                                <div className="text-sm">
                                                    {bridgeProtocols[SupportedBridgeProtocolKey.Wormhole].name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-[80px]">Recipient</div>
                                            <Link
                                                showAnchorIcon
                                                isExternal
                                                href={explorerUrl({
                                                    chainKey: preferenceChainKey,
                                                    value: accountAddress ?? "",
                                                    network,
                                                    type: "address",
                                                })}
                                                color="primary"
                                                size="sm"
                                            >
                                                {accountAddress ? truncateString(accountAddress) : ""}
                                            </Link>
                                        </div>
                                    </div>
                                ),
                                processFn: async () => {
                                    try {
                                        await formik.submitForm()
                                        onBridgeTransferResultModalDiscloresureOpen()
                                    } catch (ex) {
                                        const _ex = ex as Error
                                        console.error(_ex.message)
                                        if (_ex.name === BaseErrorName.AtaNotFound) {
                                            dispatch(setError({ errorMessage: _ex.message }))    
                                            onErrorModalDisclosureOpen()   
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
                {formik.errors.nativeAmountPlusFee ? (
                    <>
                        <Spacer y={1.5} />
                        <div className="text-xs text-danger">
                            {replace(
                                replace(
                                    formik.errors.nativeAmountPlusFee ?? "",
                                    "AMOUNT",
                                    formik.values.amount.toString()
                                ),
                                "SYMBOL",
                                symbol
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}
