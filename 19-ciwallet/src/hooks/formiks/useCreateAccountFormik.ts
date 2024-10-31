import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"
import { useFormiks } from "."
import {
    addAccount,
    triggerSaveBaseAccounts,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import { createAccount } from "@/services"
import { v4 } from "uuid"
import { valuesWithKey } from "@/utils"

export interface CreateAccountFormikValues {
  accountNumber?: number;
  name: string;
  imageUrl: string;
}

export const _useCreateAccountFormik =
  (): FormikProps<CreateAccountFormikValues> => {
      const mnemonic = useAppSelector((state) => state.authReducer.mnemonic)
      const preferenceChainKey = useAppSelector(
          (state) => state.blockchainReducer.preferenceChainKey
      )
      const baseAccounts = useAppSelector(
          (state) => state.authReducer.baseAccounts
      )
      
      const names = valuesWithKey(
          baseAccounts[preferenceChainKey]?.accounts ?? {}
      ).map(({ name }) => name)
      const dispatch = useAppDispatch()

      const initialValues: CreateAccountFormikValues = {
          imageUrl: "",
          name: "",
      }
      
      const validationSchema = Yup.object({
          accountNumber: Yup.number()
              .nullable()
              .min(0, "Account number must be greater than or equal to 0"),
          name: Yup.string()
              .required("Name is required")
              .test("unique-name", "Name already exists", (name) => {
                  if (!name) return false
                  return !names.includes(name)
              }),
          //optional image url
          imageUrl: Yup.string().nullable().url("Invalid URL"),
      })

      const formik = useFormik({
          initialValues,
          validationSchema,
          onSubmit: async ({ accountNumber, imageUrl, name }) => {
              if (!name) {
                  name = v4()
              }
              if (!mnemonic) return
              let _accountNumber: number
              if (accountNumber === undefined) {
                  const maxAccountNumber = Math.max(
                      ...valuesWithKey(baseAccounts[preferenceChainKey].accounts).map(
                          ({ accountNumber }) => accountNumber ?? 0
                      )
                  )

                  _accountNumber = maxAccountNumber + 1
              } else {
                  _accountNumber = accountNumber
              }

              const { address, privateKey, publicKey } = await createAccount({
                  mnemonic,
                  accountNumber: _accountNumber,
                  chainKey: preferenceChainKey,
                  nearUsername: "",
              })

              dispatch(
                  addAccount({
                      chainKey: preferenceChainKey,
                      privateKey,
                      account: {
                          accountAddress: address,
                          accountNumber: _accountNumber,
                          imageUrl,
                          name,
                          publicKey,
                      },
                  })
              )
              console.log("triggerSaveBaseAccounts")
              dispatch(triggerSaveBaseAccounts())
          },
      })

      return formik
  }

export const useCreateAccountFormik = () => {
    const { createAccountFormik } = useFormiks()
    return createAccountFormik
}
