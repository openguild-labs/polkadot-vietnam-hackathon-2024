import { useContractEvents, useContractWrite } from "@thirdweb-dev/react";
import { useGetProjectPoolContract } from "./contracts"

const useWithDrawFund = (projectId: string) => {
    const poolContract = useGetProjectPoolContract(
        projectId
    );

    if (!poolContract) {
        alert("failed to get pool contract");
        return;
    }

    const { mutateAsync, isLoading, error } = useContractWrite(
        poolContract,
        "withdrawFund"
    )

    const { data: eventData, isLoading: eventLoading, error: eventError } = useContractEvents(
        poolContract,
        "ProjectWithDrawn"
    );




    return { mutateAsync, isLoading, error, eventData, eventLoading, eventError };

}

export default useWithDrawFund;