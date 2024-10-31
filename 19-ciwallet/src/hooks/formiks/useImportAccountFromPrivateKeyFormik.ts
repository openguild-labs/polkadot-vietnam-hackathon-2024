import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"
import { useFormiks } from "."
import { triggerSaveBaseAccounts, useAppDispatch, useAppSelector, addAccount } from "@/redux"
import { importAccount } from "@/services"
import { triggerErrorToast } from "@/toasts"
import { valuesWithKey } from "@/utils"
export interface ImportAccountFromPrivateKeyFormikValues {
  privateKey: string;
  name: string;
  imageUrl: string;
}

export const _useImportAccountFromPrivateKeyFormik =
  (): FormikProps<ImportAccountFromPrivateKeyFormikValues> => {
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

      const initialValues: ImportAccountFromPrivateKeyFormikValues = {
          privateKey: "",
          name: "",
          imageUrl: "",
      }

      const validationSchema = Yup.object({
          privateKey: Yup.string().required("Private key is required"),
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
          onSubmit: ({ privateKey, name, imageUrl }) => {
              try {
                  const { address, publicKey } = importAccount({ privateKey, chainKey: preferenceChainKey })
                  dispatch(
                      addAccount({
                          chainKey: preferenceChainKey,
                          privateKey,
                          account: {
                              name,
                              imageUrl,
                              accountAddress: address,
                              publicKey,
                          }
                      })
                  )
                  dispatch(triggerSaveBaseAccounts())
              } catch (ex) {
                  console.error(ex)
                  triggerErrorToast("Invalid private key")
              }       
          }
      })

      return formik
  }

export const useImportAccountFromPrivateKeyFormik = () => {
    const { importAccountFromPrivateKeyFormik } = useFormiks()
    return importAccountFromPrivateKeyFormik
}
