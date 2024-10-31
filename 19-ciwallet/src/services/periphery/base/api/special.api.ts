import { envConfig, Network } from "@/config"
import { baseAxios } from "../axios.base"

export class BasePeripherySpecialApiService {
    private readonly url: string
    constructor() {
        this.url = `${envConfig().externals.periphery.api}/special`
    }

    public async createNearAccount(
        params: CreateNearAccountParams
    ): Promise<CreateNearAccountResponse> {
        const { data } = await baseAxios.post(
            `${this.url}/create-near-account`,
            params
        )
        return data
    }
}

export interface CreateNearAccountParams {
  username: string;
  publicKey: string;
  network?: Network;
}

export interface CreateNearAccountResponse {
  transactionHash: string;
}
