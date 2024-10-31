import { chainConfig } from "@/config";
import { useChainId, useContractRead } from "@thirdweb-dev/react";
import { useGetProjectPoolContract } from "./contracts";

const useGetMyProjectInfo = (projectId: number | string) => {
    const poolContract = useGetProjectPoolContract(projectId);
    const {
        data: raisedAmount,
        isLoading,
        error,
    } = useContractRead(poolContract, "getProjectRaisedAmount");

    const {
        data: isProjectSoftCapReached,
        isLoading: loading,
        error: softCapError,
    } = useContractRead(poolContract, "getProjectSoftCapReached");

    return {
        raisedAmount,
        isLoading,
        error,
        isProjectSoftCapReached,
        loading,
        softCapError,
    };
};

export default useGetMyProjectInfo;
