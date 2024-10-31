import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"
import { useFormiks } from "."
import { constantConfig } from "@/config"
import { setPassword, useAppDispatch, useAppSelector } from "@/redux"
import { BaseAccounts, createAccount, saveEncryptedBaseAccounts, saveEncryptedMnemonic } from "@/services"
import { useRouterWithSearchParams } from "../miscellaneous"

export interface CreatePasswordFormikValues {
    password: string;
    //2 step to create near
    nearUsername: string;
}

export const _useCreatePasswordFormik = (): FormikProps<CreatePasswordFormikValues> => {

    const router = useRouterWithSearchParams()

    const mnemonic = useAppSelector((state) => state.authReducer.mnemonic)
    const dispatch = useAppDispatch()

    const initialValues: CreatePasswordFormikValues = {
        password: "",
        nearUsername: "",
    }

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
        nearUsername: Yup.string().required("Subdomain is required"),
    })

    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const chainKeys = Object.keys(chains)
    const network = useAppSelector((state) => state.blockchainReducer.network)

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async ({ password, nearUsername }) => {
            saveEncryptedMnemonic({
                mnemonic,
                password
            })
            const baseAccounts : BaseAccounts = {}
            //create session here
            for (const chainKey of chainKeys) {
                //create account
                const { address, privateKey, publicKey} = await createAccount({
                    mnemonic,
                    accountNumber: 0,
                    chainKey,
                    nearUsername,
                    network
                })

                baseAccounts[chainKey] = {
                    accounts: {
                        [privateKey]: {
                            name: "User",
                            imageUrl: "",
                            accountAddress: address,
                            publicKey: publicKey,
                            accountNumber: 0,
                        }
                    },
                    activePrivateKey: privateKey,
                }
            }
            saveEncryptedBaseAccounts({
                baseAccounts,
                password
            })
            dispatch(setPassword(password))
            router.push(constantConfig().path.home)
        },
    })

    return formik
}

export const useCreatePasswordFormik = () => {
    const { createPasswordFormik } = useFormiks()
    return createPasswordFormik
}