import { envConfig } from "@/config"
import { GameVersionEntity } from "../types"
import { baseAxios } from "../axios.cifarm"

export class CifarmPeripheryGameApiService {
    private readonly url: string
    constructor() {
        this.url = `${envConfig().externals.cifarm.periphery.api}/game`
    }

    public async getGameVersion(): Promise<GameVersionEntity> {
        const { data } = await baseAxios.get(`${this.url}/version`)
        return data
    }
}
