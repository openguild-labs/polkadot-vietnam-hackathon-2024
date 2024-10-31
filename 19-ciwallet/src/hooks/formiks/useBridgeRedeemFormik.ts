import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"
import { useFormiks } from "."
import {
    setBridgeRedeemResult,
    useAppDispatch,
    useAppSelector,
    useVaa,
} from "@/redux"
import {
    parseNetwork,
    redeem,
    toWormholeNativeFromUniversal,
} from "@/services"
import { useBalance, useGenericSigner } from "../miscellaneous"
import { deserialize, VAA } from "@wormhole-foundation/sdk"
import { valuesWithKey } from "@/utils"
import {
    defaultChainKey,
    defaultSecondaryChain,
    defaultSecondaryChainKey,
    nativeTokenKey,
} from "@/config"

export interface BridgeRedeemFormikValues {
  nativeAmountPlusFee: number;
}

//wormhole only
export const _useBridgeRedeemFormik =
  (): FormikProps<BridgeRedeemFormikValues> => {
      const preferenceChainKey = useAppSelector(
          (state) => state.blockchainReducer.preferenceChainKey
      )
      const chains = useAppSelector((state) => state.blockchainReducer.chains)
      //wormhole only
      const supportWormhole = !!chains[preferenceChainKey].wormhole

      const selectedKey = useAppSelector((state) => state.vaaReducer.selectedKey)
      const storedVaas = useAppSelector((state) => state.vaaReducer.storedVaas)
      const vaa = storedVaas[selectedKey]

      let deserializedVaa: VAA<"TokenBridge:Transfer"> | undefined
      if (vaa) {
          deserializedVaa = deserialize(
              "TokenBridge:Transfer",
              Uint8Array.from(Buffer.from(vaa.serializedVaa, "base64"))
          )
      }

      const senderChain = valuesWithKey(chains).find(
          ({ wormhole }) =>  wormhole && (wormhole?.chain === deserializedVaa?.emitterChain)
      )
      const targetChain = valuesWithKey(chains).find(
          ({ wormhole }) => wormhole && (wormhole?.chain === deserializedVaa?.payload.to.chain)
      )

      const senderChainKey = senderChain?.key ?? defaultChainKey
      const targetChainKey = targetChain?.key ?? defaultSecondaryChainKey

      //wormhole only
      const crosschain = useAppSelector((state) => state.blockchainReducer.crosschain)
      const minimalFee = supportWormhole ? Object.values(crosschain[senderChainKey][targetChainKey]
      )[0].minimalFee : 0
 
      const initialValues: BridgeRedeemFormikValues = {
          nativeAmountPlusFee: minimalFee,
      }

      const dispatch = useAppDispatch()

      const baseAccounts = useAppSelector(
          (state) => state.authReducer.baseAccounts
      )
      const activePrivateKey = baseAccounts[targetChainKey]?.activePrivateKey
      const accountAddress =
      baseAccounts[targetChainKey]?.accounts[activePrivateKey].accountAddress

      const { balanceSwr: nativeTokenBalanceSwr } = useBalance({
          tokenKey: nativeTokenKey,
          accountAddress: supportWormhole ? accountAddress : "",
          chainKey: targetChain?.key ?? defaultSecondaryChainKey,
      })

      const validationSchema = Yup.object({
          nativeAmountPlusFee:
        nativeTokenBalanceSwr.data !== undefined
            ? Yup.number().max(
                nativeTokenBalanceSwr.data,
                `Your native balance is insufficient (Required: ${minimalFee} SYMBOL)`
            )
            : Yup.number(),
      })

      const network = useAppSelector((state) => state.blockchainReducer.network)

      const signer = useGenericSigner(
          targetChain?.key,
          deserializedVaa?.payload.to.address
              ? toWormholeNativeFromUniversal(
                  targetChain?.wormhole?.chain ?? defaultSecondaryChain,
                  deserializedVaa.payload.to.address
              )
              : ""
      )
    
      const formik = useFormik({
          initialValues,
          validationSchema,
          onSubmit: async () => {
              if (!vaa) return
              if (!signer) return
              if (!deserializedVaa) return

              const txHash = await redeem({
                  signer,
                  vaa: deserialize(
                      "TokenBridge:Transfer",
                      Uint8Array.from(Buffer.from(vaa.serializedVaa, "base64"))
                  ),
                  redeemAddress: signer.address(),
                  senderChainName: deserializedVaa.emitterChain,
                  redeemChainName: deserializedVaa.payload.to.chain,
                  network: parseNetwork(network),
              })

              dispatch(setBridgeRedeemResult({ txHash, vaa }))
              dispatch(useVaa(selectedKey))
          },
      })

      return formik
  }

export const useBridgeRedeemFormik = () => {
    const { bridgeRedeemFormik } = useFormiks()
    return bridgeRedeemFormik
}
