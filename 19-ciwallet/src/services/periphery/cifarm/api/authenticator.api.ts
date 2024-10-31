import { envConfig } from "@/config"

export class AuthenticatorPeripheryApiService {
    private readonly url: string
    constructor() 
    {
        this.url = `${envConfig().externals.cifarm.periphery.api}/authenticator`
    }
}

export interface RegisterTelegramParams {
    initDataRaw: string,
    botType: BotType
}

export enum BotType {
    Ciwallet = "ciwallet",
    Cifarm = "cifarm"
}

export const defaultBotType = BotType.Ciwallet
