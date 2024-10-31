import { ApiResponse } from "@/config/api.config";
import { ImmerStateCreator } from "./useStore";
import { User } from "@/types";
import { UserService } from "@/service";


export interface UserSlice {
  userList: User[];
  network: string,
  fetchUser: () => Promise<void>;
  setNetwork: (chain: string) => void;
};

export const createUserSlice: ImmerStateCreator<UserSlice> = (set) => ({
  userList: [],
  network: "Ethereum",

  fetchUser: async() => {
    const res = await UserService.getAllUser() ;
    if (res.success) {
      set((state) => {
        state.userList = res.metadata;
      });
    } else {
      set((state) => {
        state.userList = [];
      });
    }
  },

  setNetwork: (chain: string) => {
    set((state) => {
      state.network = chain;
    })
  },
});
