import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"
import { serialize } from "@wormhole-foundation/sdk"
import { useFormiks } from "."
import {
    defaultChainKey,
    nativeTokenKey,
    defaultSecondaryChainKey,
    SupportedBridgeProtocolKey,
    defaultChain,
    defaultSecondaryChain,
} from "@/config"
import { useEffect } from "react"
import {
    addStoredVaa,
    setBridgeTransferResult,
    StoredVaa,
    triggerSaveStoredVaas,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    transfer,
    parseNetwork,
    readAssociatedTokenAccount,
    chainKeyToPlatform,
    Platform,
    getWrappedAsset,
} from "@/services"
import { useBalance, useSigner } from "../miscellaneous"
import { BaseError, BaseErrorName, computeRaw } from "@/utils"

export interface BridgeTransferFormikValues {
  targetChainKey: string;
  targetPrivateKey: string;
  targetAddress: "";
  amount: number;
  tokenKey: string;
  balance: number;
  nativeAmountPlusFee: number;
}
//wormhole only
export const _useBridgeTransferFormik =
  (): FormikProps<BridgeTransferFormikValues> => {
      const chains = useAppSelector((state) => state.blockchainReducer.chains)
      const preferenceChainKey = useAppSelector(
          (state) => state.blockchainReducer.preferenceChainKey
      )

      //wormhole only
      const supportWormhole = !!chains[preferenceChainKey].wormhole

      const baseAccounts = useAppSelector(
          (state) => state.authReducer.baseAccounts
      )

      const defaultPrivateKey = baseAccounts[defaultChainKey]?.activePrivateKey
      const defaultSecondaryPrivateKey =
      baseAccounts[defaultSecondaryChainKey]?.activePrivateKey

      const _defaultTargetPrivateKey =
      preferenceChainKey === defaultChainKey
          ? defaultSecondaryPrivateKey
          : defaultPrivateKey
      const _defaultSecondaryChainKey =
      preferenceChainKey === defaultChainKey
          ? defaultSecondaryChainKey
          : defaultChainKey

      const crosschain = useAppSelector((state) => state.blockchainReducer.crosschain)
      const minimalFee = supportWormhole ? Object.values(
          crosschain[preferenceChainKey][_defaultSecondaryChainKey]
      )[0].minimalFee : 0

      const initialValues: BridgeTransferFormikValues = {
          amount: 0,
          targetPrivateKey: _defaultTargetPrivateKey,
          targetAddress: "",
          targetChainKey: _defaultSecondaryChainKey,
          tokenKey: nativeTokenKey,
          balance: 0,
          nativeAmountPlusFee: minimalFee,
      }

      const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
      const accountAddress =
      baseAccounts[preferenceChainKey]?.accounts[activePrivateKey]
          ?.accountAddress

      const { balanceSwr: nativeTokenBalanceSwr } = useBalance({
          tokenKey: nativeTokenKey,
          //fetch only if wormhole is supported
          accountAddress: supportWormhole ? accountAddress : "",
          chainKey: preferenceChainKey,
      })

      const validationSchema = Yup.object({
          amount: Yup.number()
              .min(0, "Amount must be higher than 0")
              .max(Yup.ref("balance"), "Insufficient balance.")
              .required("Amount is required"),
          nativeAmountPlusFee:
        nativeTokenBalanceSwr.data !== undefined
            ? Yup.number().max(nativeTokenBalanceSwr.data, ({ value }) =>
                Number(value) <= minimalFee
                    ? `Your native balance plus fee is insufficient (Required: ${minimalFee} SYMBOL)`
                    : `Your native balance plus fee is insufficient (Required: AMOUNT + ${minimalFee} SYMBOL)`
            )
            : Yup.number(),
      })

      const network = useAppSelector((state) => state.blockchainReducer.network)

      const dispatch = useAppDispatch()

      const tokens = chains[preferenceChainKey].tokens

      const signer = useSigner(preferenceChainKey)

      const formik = useFormik({
          initialValues,
          validationSchema,
          onSubmit: async ({
              targetPrivateKey,
              targetAddress,
              targetChainKey,
              amount,
              tokenKey,
          }) => {
              const { decimals, address: _address } = tokens[tokenKey][network]
              if (!_address) return

              let recipientAddress =
          targetAddress ||
          baseAccounts[targetChainKey].accounts[targetPrivateKey]
              .accountAddress
              if (!signer) return

              const sourceChain =
          chains[preferenceChainKey].wormhole?.chain || defaultChain
              const targetChain =
          chains[targetChainKey].wormhole?.chain || defaultSecondaryChain
              //except for case solana, which use ata instead
              const platform = chainKeyToPlatform(targetChainKey)
              if (platform === Platform.Solana) {
                  const wrapped = await getWrappedAsset({
                      sourceChainName: sourceChain,
                      sourceTokenAddress: _address,
                      foreignChainName: targetChain,
                      network: parseNetwork(network),
                  })
                  console.log(wrapped)

                  const ataPublicKey = await readAssociatedTokenAccount({
                      accountAddress: recipientAddress,
                      mintAddress: wrapped.toString(),
                      chainKey: targetChainKey,
                      network,
                  })
                  if (ataPublicKey === null) {
                      throw new BaseError(
                          BaseErrorName.AtaNotFound,
                          "Recipient's associated token account does not exist."
                      )
                  }

                  recipientAddress = ataPublicKey
              }

              const { txHash, vaa } = await transfer({
                  signer,
                  transferAmount: computeRaw(amount, decimals || 8),
                  sourceChainName: sourceChain,
                  targetChainName: targetChain,
                  network: parseNetwork(network),
                  recipientAddress: recipientAddress,
                  tokenAddress: _address,
              })
              if (vaa === null) return
              const serializedVaa = Buffer.from(serialize(vaa)).toString("base64")
              const _vaa: StoredVaa = {
                  network,
                  senderAddress: accountAddress,
                  serializedVaa,
                  txHash,
                  bridgeProtocolKey: SupportedBridgeProtocolKey.Wormhole,
                  tokenInfo: tokens[tokenKey][network],
                  decimals: tokens[tokenKey][network].decimals,
              }
              dispatch(
                  setBridgeTransferResult({
                      vaa: _vaa,
                      txHash,
                  })
              )
              dispatch(addStoredVaa(_vaa))
              dispatch(triggerSaveStoredVaas())
          },
      })

      useEffect(() => {
          formik.setFieldValue(
              "targetChainKey",
              preferenceChainKey === defaultSecondaryChainKey
                  ? defaultChainKey
                  : defaultSecondaryChainKey
          )
          formik.setFieldValue("tokenKey", nativeTokenKey)
      }, [preferenceChainKey])

      return formik
  }

export const useBridgeTransferFormik = () => {
    const { bridgeTransferFormik } = useFormiks()
    return bridgeTransferFormik
}
