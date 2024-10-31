import { generateMnemonic, mnemonicToSeed } from "../bip39"

export enum MnemonicWords {
  _12_WORDS,
  _24_WORDS,
}

export const getMnemonic = (
    mnemonicWords: MnemonicWords = MnemonicWords._12_WORDS
) => {
    const numWordsMap = {
        [MnemonicWords._12_WORDS]: 12,
        [MnemonicWords._24_WORDS]: 24,
    }
    return generateMnemonic(numWordsMap[mnemonicWords])
}

export interface GetSeedParams {
  accountNumber: number;
  mnemonic: string;
}

export const getSeed = ({ accountNumber, mnemonic }: GetSeedParams): Buffer => {
    return mnemonicToSeed({
        mnemonic,
        password: accountNumber.toString(),
    })
}
