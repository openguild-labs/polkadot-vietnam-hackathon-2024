import { useAppSelector } from "@/redux"
import { saveEncryptedBaseAccounts, saveChains, saveVaas } from "@/services"
import { useEffect } from "react"

export const useSaveToLocalStorage = () => {
    const baseAccounts = useAppSelector(
        (state) => state.authReducer.baseAccounts
    )

    const saveBaseAccountsKey = useAppSelector((state) => state.authReducer.saveBaseAccountsKey)
    const storedVaas = useAppSelector((state) => state.vaaReducer.storedVaas)
    const saveStoredVaasKey = useAppSelector((state) => state.vaaReducer.saveStoredVaasKey)
    const password = useAppSelector((state) => state.authReducer.password)

    const chains = useAppSelector((state) => state.blockchainReducer.chains)
    const saveChainsKey = useAppSelector((state) => state.blockchainReducer.saveChainsKey)
    
    useEffect(() => {
        if (saveBaseAccountsKey) {
            console.log(`Saving base accounts: ${Object.keys(baseAccounts).length}`)
            saveEncryptedBaseAccounts({
                baseAccounts,
                password
            })
        }
    }, [saveBaseAccountsKey])

    useEffect(() => {
        if (!saveStoredVaasKey) return
        saveVaas(storedVaas)
    }, [saveStoredVaasKey])

    useEffect(() => {
        if (!saveChainsKey) return
        saveChains(chains)
    }, [saveChainsKey])
}
