import { UseCifarmNakamaReturn, _useCifarmNakama } from "./useCifarmNakama"
import { _useCifarmDb, UseCifarmDbReturn } from "./useCifarmDb"
import { useGames } from ".."

export interface UseCifarmReturn {
    cifarmNakama: UseCifarmNakamaReturn
    cifarmDb: UseCifarmDbReturn
}

export const _useCifarm = () : UseCifarmReturn => {
    const cifarmNakama = _useCifarmNakama()
    const cifarmDb = _useCifarmDb()
    return {
        cifarmNakama,
        cifarmDb
    }
}

export const useCifarm = () => {
    const { cifarm } = useGames()
    return cifarm
}

export * from "./useCifarmNakama"
export * from "./useCifarmDb"
