"use client"
import {
    useBridgeRedeemFormik,
    useBridgeRedeemResultModalDiscloresure,
    useConfirmModalDisclosure,
    useErrorModalDisclosure,
} from "@/hooks"
import { Button, Spacer, Image, Link } from "@nextui-org/react"
import React, { useEffect } from "react"
import { EmptyProfile } from "./EmptyProfile"
import { VAAProfile } from "./VAAProfile"
import { setConfirm, TransactionType, useAppDispatch, useAppSelector } from "@/redux"
import { v4 } from "uuid"
import { deserialize } from "@wormhole-foundation/sdk"
import { bridgeProtocols, defaultChain, defaultChainKey, defaultSecondaryChain, defaultSecondaryChainKey, nativeTokenKey } from "@/config"
import { computeDenomination, replace, truncateString, valuesWithKey } from "@/utils"
import { explorerUrl, toWormholeNativeFromUniversal } from "@/services"

export const RedeemTab = () => {
    const selectedKey = useAppSelector((state) => state.vaaReducer.selectedKey)
    const storedVaas = useAppSelector((state) => state.vaaReducer.storedVaas)

    const {
        serializedVaa,
        network,
        bridgeProtocolKey,
        decimals
    } = storedVaas[selectedKey]
    const { emitterChain, payload } = deserialize(
        "TokenBridge:Transfer",
        Uint8Array.from(Buffer.from(serializedVaa, "base64"))
    )
    
    const formik = useBridgeRedeemFormik()

    const { onOpen: onBridgeRedeemResultModalOpen } =
    useBridgeRedeemResultModalDiscloresure()

    const { onOpen: onConfirmModalDisclosureOpen } =
    useConfirmModalDisclosure()

    const { onOpen: onErrorModalDisclosureOpen } =
    useErrorModalDisclosure()

    const dispatch = useAppDispatch()
    
    const hasVaa = Object.values(storedVaas).length > 0
    const protocol = bridgeProtocols[bridgeProtocolKey]

    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const valuesWithKeyChains = valuesWithKey(chains)
    
    const fromChain = valuesWithKeyChains.find(
        ({ wormhole }) => wormhole?.chain === emitterChain
    )
    const targetChain = valuesWithKeyChains.find(
        ({ wormhole }) => wormhole?.chain === payload.to.chain
    )

    const token = chains[targetChain?.key ?? defaultSecondaryChainKey].tokens[nativeTokenKey]
    const { symbol } = { ...token[network] }

    const _defaultChainKey = targetChain?.key === defaultSecondaryChainKey ? defaultChainKey : defaultSecondaryChainKey
    const crosschain = useAppSelector((state) => state.blockchainReducer.crosschain)

    const minimalFee = Object.values(crosschain[targetChain?.key ?? defaultSecondaryChainKey][_defaultChainKey])[0].minimalFee
    useEffect(() => {
        formik.setFieldValue("nativeAmountPlusFee", minimalFee)
    }, [])
      
    return (
        <div className="w-full h-full gap-6 flex flex-col justify-between">
            <div>
                <div className="text-sm">Select VAA</div>
                <Spacer y={1.5} />
                <div>{hasVaa ? <VAAProfile /> : <EmptyProfile />}</div>
            </div>
            <div>
                <Button
                    color="primary"
                    isDisabled={!hasVaa || !formik.isValid}
                    onPress={async () => {
                        dispatch(
                            setConfirm({
                                type: TransactionType.BridgeRedeem,
                                confirmMessage: (
                                    <div className="grid gap-2">
                                        <div className="flex gap-1 items-center">
                                            <div className="w-[80px] text-sm">Protocol</div>
                                            <div className="flex gap-1 items-center">
                                                <Image
                                                    removeWrapper
                                                    className="w-5 h-5"
                                                    src={protocol?.imageUrl}
                                                />
                                                <div className="text-sm">{protocol?.name}</div>
                                            </div>
                                        </div>
                                        <Spacer y={2} />
                                        <div className="flex gap-2 items-center">
                                            <div className="w-[80px]">Path</div>
                                            <div className="flex gap-1 items-center">
                                                <Image
                                                    removeWrapper
                                                    className="w-5 h-5"
                                                    src={fromChain?.imageUrl}
                                                />
                                                <div className="text-sm">
                                                    {fromChain?.name}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">to</div>
                                            <div className="flex gap-1 items-center">
                                                <Image
                                                    removeWrapper
                                                    className="w-5 h-5"
                                                    src={targetChain?.imageUrl}
                                                />
                                                <div className="text-sm">
                                                    {targetChain?.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <div className="w-[80px] text-sm">Token</div>
                                            <Link
                                                size="sm"
                                                isExternal
                                                showAnchorIcon
                                                href={explorerUrl({
                                                    chainKey: fromChain?.key ?? defaultChainKey,
                                                    value: toWormholeNativeFromUniversal(
                                                        fromChain?.wormhole?.chain ?? defaultChain,
                                                        payload.token.address
                                                    ),
                                                    type: "address",
                                                    network,
                                                })}
                                            >
                                                {truncateString(
                                                    toWormholeNativeFromUniversal(
                                                        fromChain?.wormhole?.chain ?? defaultChain,
                                                        payload.token.address
                                                    ),
                                                )}
                                            </Link>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <div className="w-[80px] text-sm">Amount</div>
                                            <div className="text-sm">
                                                {computeDenomination(payload.token.amount, decimals)}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <div className="w-[80px] text-sm">To</div>
                                            <Link
                                                size="sm"
                                                isExternal
                                                showAnchorIcon
                                                href={explorerUrl({
                                                    chainKey: targetChain?.key ?? defaultSecondaryChainKey,
                                                    value: toWormholeNativeFromUniversal(
                                                        targetChain?.wormhole?.chain ?? defaultSecondaryChain,
                                                        payload.to.address
                                                    ),
                                                    type: "address",
                                                    network,
                                                })}
                                            >
                                                {truncateString(
                                                    toWormholeNativeFromUniversal(
                                                        targetChain?.wormhole?.chain ?? defaultSecondaryChain,
                                                        payload.to.address
                                                    ),
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                ),
                                processFn: async () => {
                                    try {
                                        await formik.submitForm()
                                        onBridgeRedeemResultModalOpen()
                                    } catch (ex) {
                                        console.error(ex)
                                        onErrorModalDisclosureOpen()
                                    }
                                },
                                id: v4(),
                            })
                        )
                        onConfirmModalDisclosureOpen()
                    }}
                    fullWidth
                >
          Redeem
                </Button>
                {formik.errors.nativeAmountPlusFee ? (
                    <>
                        <Spacer y={1.5} />
                        <div className="text-xs text-danger">
                            {replace(
                                formik.errors.nativeAmountPlusFee ?? "",
                                "SYMBOL",
                                symbol ?? ""
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}
