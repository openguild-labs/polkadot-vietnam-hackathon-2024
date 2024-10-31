import { ChainInfo, defaultChainKey } from "@/config"
import { deserialize, serialize } from "./serialization.storage"
import { decrypt, encrypt, EncryptedResult } from "../cryptography"
import { StoredVaas } from "@/redux"

const ENCRYPTED_BASE_ACCOUNTS = "ciwallet-encrypted-base-accounts"
const ENCRYPTED_MNEMONIC = "ciwallet-encrypted-mnemonic"
const PREFERENCE_CHAIN = "ciwallet-preference-chain"
const VAAS = "ciwallet-vaas"
const CHAINS = "ciwallet-chains"
const GAME_VERSION = "game-version"

export interface StoredAccount {
    imageUrl: string;
    name: string;
    accountNumber?: number;
    accountAddress: string;
    publicKey: string;
}
  
export interface ChainBaseAccount {
    accounts: Record<string, StoredAccount>;
    activePrivateKey: string;
}
  
export type BaseAccounts = Record<string, ChainBaseAccount>;

export interface EncryptBaseAccountsParams {
  baseAccounts: BaseAccounts;
  password: string;
}

export const saveEncryptedBaseAccounts = ({
    password,
    baseAccounts,
}: EncryptBaseAccountsParams) => {
    const result = encrypt({
        key: password,
        data: serialize(baseAccounts),
    })
    localStorage.setItem(ENCRYPTED_BASE_ACCOUNTS, serialize(result))
}

export const loadBaseAccounts = (password: string): BaseAccounts | null => {
    const found = localStorage.getItem(ENCRYPTED_BASE_ACCOUNTS)
    if (!found) return null
    const encryptedResult = deserialize(found) as EncryptedResult
    const data = decrypt({
        encryptedData: encryptedResult.data,
        key: password,
        iv: encryptedResult.iv,
    })
    return deserialize(data)
}

export interface EncryptMnemonicParams {
  mnemonic: string;
  password: string;
}

export const saveEncryptedMnemonic = ({
    mnemonic,
    password,
}: EncryptMnemonicParams) => {
    const result = encrypt({
        key: password,
        data: mnemonic,
    })
    localStorage.setItem(ENCRYPTED_MNEMONIC, serialize(result))
}

export const clearStorage = () => {
    localStorage.removeItem(VAAS)
    localStorage.removeItem(PREFERENCE_CHAIN)
    localStorage.removeItem(CHAINS)
    localStorage.removeItem(ENCRYPTED_BASE_ACCOUNTS)
    localStorage.removeItem(ENCRYPTED_MNEMONIC)
}

export const loadMnemonic = (password: string) => {
    const found = localStorage.getItem(ENCRYPTED_MNEMONIC)
    if (!found) return ""
    const encryptedResult = deserialize(found) as EncryptedResult
    return decrypt({
        encryptedData: encryptedResult.data,
        key: password,
        iv: encryptedResult.iv,
    })
}

export const foundEncryptedMnemonic = () => {
    return !!localStorage.getItem(ENCRYPTED_MNEMONIC)
}

export const foundEncryptedBaseAccounts = () => {
    return !!localStorage.getItem(ENCRYPTED_BASE_ACCOUNTS)
}

export const savePreferenceChainKey = (preferenceChainKey: string) => {
    localStorage.setItem(PREFERENCE_CHAIN, preferenceChainKey)
}

export const loadPreferenceChainKey = () => {
    return localStorage.getItem(PREFERENCE_CHAIN) ?? defaultChainKey
}

export const saveVaas = (vaas: StoredVaas) => {
    localStorage.setItem(VAAS, serialize(vaas))
}

export const loadVaas = (): StoredVaas | null => {
    const found = localStorage.getItem(VAAS)
    return found !== null ? deserialize(found) : null
}

export const saveChains = (chains: Record<string, ChainInfo>) => {
    localStorage.setItem(CHAINS, serialize(chains))
}

export const loadChains = (): Record<string, ChainInfo> | null => {
    const found = localStorage.getItem(CHAINS)
    return found !== null ? deserialize(found) : null
}

export const saveGameVersion = (version: string) => {
    localStorage.setItem(GAME_VERSION, version)
}

export const loadGameVersion = (): string | null => {
    return localStorage.getItem(GAME_VERSION)
}
