import API, { ApiResponse } from "@/config/api.config";
import { User } from "@/types/user.type";

interface createNewUser {
  wallet_address: string,
  balance: number,
}

class CreateUserService {
    createUser = async (data: createNewUser) => {
      return await API.POST<ApiResponse<User>>("/user", data);
    };
  
    getUser = async (userId: string) => {
      return await API.GET<ApiResponse<User>>(`/user/${userId}`);
    };
    
    getAllUser = async() => {
      return await API.GET<ApiResponse<User[]>>("/users");
    };

    deleteUser = async(userId: string) => {
      return await API.DELETE<ApiResponse<User>>(`/user/${userId}`);
    }

    createWallet = async (data: string) => {
      return await API.PATCH<ApiResponse<any>>("/auth/connect-wallet", data);
    };
  
    disconnectWallet = async (walletId: string) => {
      return await API.DELETE<ApiResponse<any>>(`/auth/disconnect-wallet/${walletId}`);
    };
  
  }
  
  const UserService = new CreateUserService();
  export { UserService };
  