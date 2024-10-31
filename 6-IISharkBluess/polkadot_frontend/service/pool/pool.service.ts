import API, { ApiResponse } from "@/config/api.config";
import { Pool } from "@/types/pool.type";

interface createNewPool {
  pairId: string;
  name: string;
  creator: string;
  collateral_amount: number;
  profit: number;
  expire: number;
}

class CreatePoolService {
  createPool = async (data: createNewPool) => {
    return await API.POST<ApiResponse<Pool>>("/pool", data);
  };

  getPool = async (poolId: string) => {
    return await API.GET<ApiResponse<Pool>>(`/pool/${poolId}`);
  };

  getAllPool = async () => {
    return await API.GET<ApiResponse<Pool[]>>("/pools");
  };

  updatePool = async (poolId: string, data: createNewPool) => {
    return await API.PATCH<ApiResponse<Pool>>("/pool", { poolId, data });
  };

  deletePool = async (poolId: string) => {
    return await API.DELETE<ApiResponse<Pool>>(`/pool/${poolId}`);
  };
}

const PoolService = new CreatePoolService();
export { PoolService };
