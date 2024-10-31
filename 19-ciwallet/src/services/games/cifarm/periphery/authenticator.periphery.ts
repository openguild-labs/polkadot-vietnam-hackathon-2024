import { envConfig } from "@/config"
import axios from "axios"

export interface RequestMessageResponseData {
  message: string;
}

export interface RequestMessageResponse {
  message: string;
  data: RequestMessageResponseData;
}

const baseUrl = `${envConfig().externals.cifarm.periphery.api}/authenticator`

export const requestMessage = async (): Promise<RequestMessageResponse> => {
    const url = `${baseUrl}/request-message`
    const { data } = await axios.post(url)
    return data
}
