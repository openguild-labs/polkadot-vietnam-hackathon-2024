import { use } from "react"
import { HooksContext } from "../provider.hooks"
import { _useCifarm, UseCifarmReturn } from "./cifarm"

export interface UseGamesReturn {
  cifarm: UseCifarmReturn;
}

export const _useGames = (): UseGamesReturn => {
    const cifarm = _useCifarm()
    return {
        cifarm,
    }
}

export const useGames = () => {
    const { games } = use(HooksContext)!
    return games
}

export * from "./cifarm"