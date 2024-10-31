import { exec, ChildProcess } from "child_process";
import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";

export function startAnvil(): ChildProcess {
    // Spawn Anvil process
    const anvilProcess = exec("anvil", (error, stdout, stderr) => {
        if (error) {
            console.error(
                "\x1b[31m%s\x1b[0m",
                `Error starting Anvil: ${error.message}`
            );
            return;
        }
        if (stderr) {
            console.error("\x1b[31m%s\x1b[0m", `Anvil stderr: ${stderr}`);
            return;
        }
        console.log(`Anvil output: ${stdout}`);
    });

    // Set up a handler to kill the Anvil process when the Node.js process exits
    process.on("exit", () => {
        console.log("Stopping Anvil...");
        anvilProcess.kill();
    });

    return anvilProcess;
}

export function getSigner(
    privateKey: string,
    provider: ethers.providers.BaseProvider
): ethers.Wallet {
    const wallet = new ethers.Wallet(privateKey); // Insert a private key from Anvil's default accounts
    const signer = wallet.connect(provider);
    return signer;
}

export function getProvider(url: string): ethers.providers.JsonRpcProvider {
    const provider = new ethers.providers.JsonRpcProvider(url); // Insert a private key from Anvil's default accounts
    return provider;
}

// Example: Interacting with Anvil via ethers.js
export async function deployContract(
    contractName: string,
    signer: ethers.Wallet,
    nameAlias: string | undefined,
    ...constructorArgs: any[]
): Promise<ethers.Contract> {
    const artifactsPath = "src/abi/".concat(contractName, ".json");
    const artifacts = readFileSync(artifactsPath, { encoding: "utf-8" });
    const artifactsJSON = JSON.parse(artifacts);
    const abi = artifactsJSON["abi"];
    const bytecode = artifactsJSON["bytecode"];
    if (!abi || !bytecode) {
        throw new Error("abi/bytecode of contract not found");
    }
    const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

    // Deploy the contract
    const contract = await contractFactory.deploy(...constructorArgs);

    // Wait for the deployment transaction to be mined
    await contract.deployTransaction.wait();

    // write new contract address to chainConfig file
    //   let chainConfigJSON = JSON.parse(
    //     readFileSync("src/config/chainConfig.json", { encoding: "utf-8" })
    //   );
    //   const nameInConfig = !!nameAlias ? nameAlias : contractName;
    //   if (
    //     Object.keys(chainConfigJSON[31337]?.contracts)?.findIndex(
    //       (v) => v === nameInConfig
    //     ) != -1
    //   ) {
    //     chainConfigJSON[31337]["contracts"][nameInConfig]["address"] =
    //       contract.address;
    //   }
    //   writeFileSync(
    //     "src/config/chainConfig.json",
    //     JSON.stringify(chainConfigJSON, null, 2)
    //   );
    // console.log(
    //     "\x1b[32m%s\x1b[0m",
    //     `Saved ${nameInConfig} contract address to src/config/chainConfig.json`
    // );
    return contract;
}

export async function getCurrentBlockTimestamp(
    provider: ethers.providers.Provider
): Promise<number> {
    const block = await provider.getBlock("latest");
    return block.timestamp;
}

async function run(): Promise<void> {
    const provider = getProvider("http://127.0.0.1:8545");

    const foundryTestPrivKey =
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = getSigner(foundryTestPrivKey, provider);

    // deploy ProjectPoolFactory contract
    const factoryContract = await deployContract(
        "ProjectPoolFactory",
        signer,
        undefined,
        ethers.constants.AddressZero
    );
    const factoryAddr = factoryContract.address;

    // deploy mockVToken and mockProjectToken
    const mockVTokenContract = await deployContract(
        "MockVToken",
        signer,
        undefined
    );
    const mockVTokenAddr = mockVTokenContract.address;

    const mockProjectTokenContract = await deployContract(
        "MockProjectToken",
        signer,
        undefined
    );
    const mockProjectTokenAddr = mockProjectTokenContract.address;

    // create example project pool
    const blockTimestamp = await getCurrentBlockTimestamp(provider);
    const startTime = blockTimestamp + 1000;
    // wait 2 secs
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let currProjectID = await factoryContract.getCurrentProjectId();
    console.debug(`Current project Id is: ${currProjectID}`);
    for (let i = 0; i < 4; i++) {
        try {
            const tx = await factoryContract.createProjectPool(
                mockProjectTokenAddr,
                BigInt(10 * 10 ** (await mockVTokenContract.decimals())), // 1 project token = 10 vTokens
                BigInt(startTime), // start time
                BigInt(startTime + 60 * 60), // end time = start time + 60 minutes
                BigInt(1 * 10 ** (await mockVTokenContract.decimals())), // min invest is 1 vTokens
                BigInt(10 * 10 ** (await mockVTokenContract.decimals())), // max invest is 10 vTokens
                BigInt(1000 * 10 ** (await mockProjectTokenContract.decimals())), // hard cap is 1000 vTokens
                BigInt(100 * 10 ** (await mockProjectTokenContract.decimals())), // soft cap is 1000 vTokens
                BigInt(50), // 0.5%,
                mockVTokenAddr
            );
            await tx.wait();
            console.trace("waiting 1 sec before deploying again");
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Increment the current project ID after successfully creating a project pool
            const poolAddr = await factoryContract.getProjectPoolAddress(currProjectID);
            console.log(
                "\x1b[36m%s\x1b[0m",
                `An example ProjectPool contract was created at address ${poolAddr}`
            );
            currProjectID++; // Increment the ID for the next pool
        } catch (error) {
            console.error("Error creating project pool:", error);
        }
    } console.log(
        "\x1b[36m%s\x1b[0m",
        `ProjectPoolFactory contract deployed to ${factoryAddr}`
    );
}

// run()
//     .then()
//     .catch((err) => console.error(err));
