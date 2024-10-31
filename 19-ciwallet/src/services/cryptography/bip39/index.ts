import {
    generateMnemonic as _generateMnemonic,
    mnemonicToSeedSync,
    validateMnemonic as _validateMnemonic
} from "bip39"

import { sha256Hash } from "../sha256"

export const generateMnemonic = (numWords: number = 24) => {
    if (numWords === 12) return _generateMnemonic()
    if (numWords === 24) return _generateMnemonic(256)
    return ""
}

export interface MnemonicToSeedParams {
  mnemonic: string;
  password: string;
  salt?: string
}

export const mnemonicToSeed = ({
    mnemonic,
    password
}: MnemonicToSeedParams) =>
    mnemonicToSeedSync(
        mnemonic,
        sha256Hash(password).substring(0, 32)
    )

export const validateMnemonic = (mnemonic: string) => _validateMnemonic(mnemonic)
