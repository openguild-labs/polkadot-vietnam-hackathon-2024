import { FormikProps } from "formik"
import { PasswordFormikValues, _usePasswordFormik } from "./usePasswordFormik"
import { use } from "react"
import { HooksContext } from "../provider.hooks"
import { _useCreatePasswordFormik, CreatePasswordFormikValues } from "./useCreatePasswordFormik"
import {
    BridgeTransferFormikValues,
    _useBridgeTransferFormik,
} from "./useBridgeTransferFormik"
import {
    CreateAccountFormikValues,
    _useCreateAccountFormik,
} from "./useCreateAccountFormik"
import {
    BridgeRedeemFormikValues,
    _useBridgeRedeemFormik,
} from "./useBridgeRedeemFormik"
import {
    MnemonicInputFormikValues,
    _useMnemonicInputFormik,
} from "./useMnemonicInputFormik"
import {
    _useBridgeWrapFormik,
    BridgeWrapFormikValues,
} from "./useBridgeWrapFormik"
import { _useTransferFormik, TransferFormikValues } from "./useTransferFormik"
import {
    _useImportAccountFromPrivateKeyFormik,
    ImportAccountFromPrivateKeyFormikValues,
} from "./useImportAccountFromPrivateKeyFormik"

export interface UseFormiksReturn {
  passwordFormik: FormikProps<PasswordFormikValues>;
  createPasswordFormik: FormikProps<CreatePasswordFormikValues>;
  bridgeTransferFormik: FormikProps<BridgeTransferFormikValues>;
  bridgeRedeemFormik: FormikProps<BridgeRedeemFormikValues>;
  createAccountFormik: FormikProps<CreateAccountFormikValues>;
  mnemonicInputFormik: FormikProps<MnemonicInputFormikValues>;
  bridgeWrapFormik: FormikProps<BridgeWrapFormikValues>;
  transferFormik: FormikProps<TransferFormikValues>;
  importAccountFromPrivateKeyFormik: FormikProps<ImportAccountFromPrivateKeyFormikValues>;
}

export const _useFormiks = (): UseFormiksReturn => {
    const passwordFormik = _usePasswordFormik()
    const createPasswordFormik = _useCreatePasswordFormik()
    const bridgeTransferFormik = _useBridgeTransferFormik()
    const bridgeRedeemFormik = _useBridgeRedeemFormik()
    const createAccountFormik = _useCreateAccountFormik()
    const mnemonicInputFormik = _useMnemonicInputFormik()
    const bridgeWrapFormik = _useBridgeWrapFormik()
    const transferFormik = _useTransferFormik()
    const importAccountFromPrivateKeyFormik =
    _useImportAccountFromPrivateKeyFormik()

    return {
        passwordFormik,
        createPasswordFormik,
        bridgeTransferFormik,
        bridgeRedeemFormik,
        createAccountFormik,
        mnemonicInputFormik,
        bridgeWrapFormik,
        transferFormik,
        importAccountFromPrivateKeyFormik,
    }
}

export const useFormiks = (): UseFormiksReturn => {
    const { formiks } = use(HooksContext)!

    return formiks
}

export * from "./usePasswordFormik"
export * from "./useCreatePasswordFormik"
export * from "./useBridgeTransferFormik"
export * from "./useBridgeRedeemFormik"
export * from "./useCreateAccountFormik"
export * from "./useBridgeWrapFormik"
export * from "./useTransferFormik"
export * from "./useImportAccountFromPrivateKeyFormik"
