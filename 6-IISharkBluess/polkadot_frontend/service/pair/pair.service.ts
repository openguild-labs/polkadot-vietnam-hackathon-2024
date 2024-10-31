import API, { ApiResponse } from "@/config/api.config";
import { Pair } from "@/types";

interface createNewPair {
  lend_token_symbol: string;
  collateral_token_symbol: string;
  lend_token: string;
  collateral_token: string;
  lend_icon: string;
  collateral_icon: string;
  lend_amount: number;
  lend_token_name: string;
  collateral_token_name: string;
}

class CreatePairService {
  createPair = async (data: createNewPair) => {
    return await API.POST<ApiResponse<Pair>>("/pair", data);
  };

  getPair = async (poolId: string) => {
    return await API.GET<ApiResponse<Pair>>(`/pair/${poolId}`);
  };

  getAllPair = async () => {
    return await API.GET<ApiResponse<Pair[]>>("/pairs");
  };

  updatePair = async (pairId: string, data: createNewPair) => {
    return await API.PATCH<ApiResponse<Pair>>("/pair", { pairId, data });
  };

  deletePair = async (pairId: string) => {
    return await API.DELETE<ApiResponse<Pair>>(`/pair/${pairId}`);
  };
}

const PairService = new CreatePairService();
export { PairService };
