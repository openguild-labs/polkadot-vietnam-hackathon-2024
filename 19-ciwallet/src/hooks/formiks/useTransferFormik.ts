import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"
import { useFormiks } from "."
import {
    nativeTokenKey,
} from "@/config"
import { useAppSelector } from "@/redux"
import { BlockchainTokenService } from "@/services"
import { triggerTransactionToast } from "@/toasts"

export interface TransferFormikValues {
  recipientAddress: string;
  amount: number;
  tokenKey: string;
  balance: number;
}

export const _useTransferFormik =
  (): FormikProps<TransferFormikValues> => {
      const initialValues: TransferFormikValues = {
          amount: 0,
          recipientAddress: "",
          tokenKey: nativeTokenKey,
          balance: 0,
      }

      const validationSchema = Yup.object({
          amount: Yup.number()
              .min(0, "Amount must be higher than 0")
              .max(Yup.ref("balance"), "Insufficient balance")
              .required("Amount is required"),
      })

      const preferenceChainKey = useAppSelector(state => state.blockchainReducer.preferenceChainKey)
      const tokens = useAppSelector(state => state.blockchainReducer.chains[preferenceChainKey].tokens)
      const network = useAppSelector(state => state.blockchainReducer.network)
      const baseAccounts = useAppSelector(state => state.authReducer.baseAccounts)
      const activePrivateKey = baseAccounts[preferenceChainKey]?.activePrivateKey
      const accountAddress = baseAccounts[preferenceChainKey]?.accounts[activePrivateKey].accountAddress

      const formik = useFormik({
          initialValues,
          validationSchema,
          onSubmit: async ({
              recipientAddress,
              amount,
              tokenKey,
          }) => {     
              if (!activePrivateKey) return
              if (!accountAddress) return
              
              const tokenAddress = tokens[tokenKey][network].address
              const tokenService = new BlockchainTokenService({
                  tokenAddress,
                  chainKey: preferenceChainKey,
                  network: network
              })
              const { txHash } = await tokenService.transferToken({
                  amount,
                  privateKey: activePrivateKey,
                  recipientAddress,
                  fromAddress: accountAddress,
              })
              triggerTransactionToast({
                  chainKey: preferenceChainKey,
                  network,
                  txHash
              })
          } 
      })

      return formik
  }

export const useTransferFormik = () => {
    const { transferFormik } = useFormiks()
    return transferFormik
}
