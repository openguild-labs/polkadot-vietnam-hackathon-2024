import {
    useContract,
    useContractRead,
    useChainId,
} from "@thirdweb-dev/react";
import { chainConfig } from "@/config";
import {
    ProjectPoolFactoryABI,
    ProjectPoolABI,
    MockVTokenABI,
} from "@/abi";
import { BaseContract } from "ethers";
import { SmartContract } from "@thirdweb-dev/react";

export function useGetProjectPoolContract(projectID: number | string): SmartContract<BaseContract> | undefined {
    // get the chain ID that user's wallet is connected
    const chainId = useChainId();

    // get factory contract address from chain configs
    const factoryAddress = chainId
        ? chainConfig[chainId.toString() as keyof typeof chainConfig]?.contracts?.ProjectPoolFactory?.address
        : undefined;

    // connect to factory contract
    const { contract: factoryContract, error: factoryConnErr } = useContract(
        factoryAddress, // Contract address
        ProjectPoolFactoryABI // Contract abi
    );

    if (factoryConnErr) {
        alert("failed to connect to factory contract");
    }

    /**
     * @dev Invoke the 'getProjectPoolAddress' func. inside ProjectPoolFactory contract
     * @notice Summary: Get the Pool address of the Project which have id = 'projectID'
     */
    let { data: poolAddress, error: factoryReadErr } = useContractRead(
        factoryContract, // contract object to call
        "getProjectPoolAddress", // function to call in contract
        [Number(projectID)] // list of function args
    );

    if (factoryReadErr) {
        alert("failed to read pool address from factory contract:\n" + factoryReadErr);
    }

    let { contract: poolContract, error: poolError } = useContract(
        poolAddress,
        ProjectPoolABI
    )

    if (poolError) {
        alert("failed to connect to Pool contract"); // temp solution
    }

    return poolContract;
}

export function useGetVTokenContract(
    poolContract: SmartContract<BaseContract>
): SmartContract<BaseContract> | undefined {
    const { data: vTokenAddr, error: poolReadErr } = useContractRead(
        poolContract,
        "getAcceptedVAsset",
    );

    if (poolReadErr) {
        alert("failed to read vAsset address from pool contract");
        return;
    }

    const { contract: vTokenContract, error: vTokenConnErr }
        = useContract(
            vTokenAddr,
            MockVTokenABI,
        );
    if (vTokenConnErr) {
        alert("failed to connect to project token contract");
        return;
    }

    return vTokenContract;
}