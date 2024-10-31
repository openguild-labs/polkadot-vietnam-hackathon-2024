import { exec, ChildProcess } from 'child_process';
import { ethers } from 'ethers';
import { readFileSync, writeFileSync } from 'fs';
import { ProjectPoolABI } from "../abi/";

export function startAnvil(): ChildProcess {
    // Spawn Anvil process
    const anvilProcess = exec('anvil', (error, stdout, stderr) => {
        if (error) {
            console.error("\x1b[31m%s\x1b[0m", `Error starting Anvil: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error("\x1b[31m%s\x1b[0m", `Anvil stderr: ${stderr}`);
            return;
        }
        console.log(`Anvil output: ${stdout}`);
    });

    // Set up a handler to kill the Anvil process when the Node.js process exits
    process.on('exit', () => {
        console.log('Stopping Anvil...');
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
    let chainConfigJSON = JSON.parse(readFileSync("src/config/chainConfig.json", { encoding: "utf-8" }));
    const nameInConfig = !!nameAlias ? nameAlias : contractName;
    if (Object.keys(chainConfigJSON[31337]?.contracts)?.findIndex((v) => v === nameInConfig) != -1) {
        chainConfigJSON[31337]["contracts"][nameInConfig]["address"] = contract.address;

        if (nameInConfig === "MockVToken") {
            let vAsset: any = (chainConfigJSON[31337]["vAssets"] as object[]).find((obj: any) => obj["symbol"] === "vASTR")
            vAsset["address"] = contract.address;
        }
    }
    writeFileSync("src/config/chainConfig.json", JSON.stringify(chainConfigJSON, null, 2));
    console.log('\x1b[32m%s\x1b[0m', `Saved ${nameInConfig} contract address to src/config/chainConfig.json`);
    return contract;
}

export async function getCurrentBlockTimestamp(provider: ethers.providers.Provider): Promise<number> {
    const block = await provider.getBlock('latest');
    return block.timestamp;
}

async function run(): Promise<void> {
    // startAnvil();

    const provider = getProvider("http://localhost:8545");

    const foundryTestPrivKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const signer = getSigner(foundryTestPrivKey, provider)

    // deploy ProjectPoolFactory contract
    const factoryContract = await deployContract(
        "ProjectPoolFactory",
        signer,
        undefined,
        ethers.constants.AddressZero,
    );
    const factoryAddr = factoryContract.address;

    // deploy mockVToken and mockProjectToken
    const mockVTokenContract = await deployContract(
        "MockVToken",
        signer,
        undefined,
    );
    const mockVTokenAddr = mockVTokenContract.address;
    await mockVTokenContract.freeMoneyForEveryone(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        BigInt(1000 * (10 ** 9) * 10 ** 18),
    );

    const mockProjectTokenContract = await deployContract(
        "MockProjectToken",
        signer,
        undefined,
    );
    const mockProjectTokenAddr = mockProjectTokenContract.address;
    await mockProjectTokenContract.freeMoneyForEveryone(
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        BigInt(1000 * (10 ** 9) * 10 ** 18),
    );
    console.log(`mockProjectToken contract deployed to ${mockProjectTokenAddr}`);
    console.log(`mockVToken contract deployed to ${mockVTokenAddr}`);

    // create example project pool
    const blockTimestamp = await getCurrentBlockTimestamp(provider);
    const startTime = blockTimestamp + 2;
    // wait 2 secs
    await new Promise(resolve => setTimeout(resolve, 2000));

    const tx = await factoryContract.createProjectPool(
        mockProjectTokenAddr,
        BigInt(10 * (10 ** await mockVTokenContract.decimals())), // 1 project token = 10 vTokens
        BigInt(startTime), // start time
        BigInt(startTime + (60 * 60)), // end time = start time + 60 minutes
        BigInt(1 * (10 ** await mockVTokenContract.decimals())), // min invest is 1 vTokens
        BigInt(10 * (10 ** await mockVTokenContract.decimals())), // max invest is 10 vTokens
        BigInt(1000 * (10 ** await mockProjectTokenContract.decimals())), // hard cap is 1000 vTokens
        BigInt(100 * (10 ** await mockProjectTokenContract.decimals())), // soft cap is 1000 vTokens
        BigInt(50), // 0.5%,
        mockVTokenAddr,
    );

    const waitTx = await tx.wait();
    console.log(waitTx);
    const poolAddr = await factoryContract.getProjectPoolAddress(1);

    console.log('\x1b[36m%s\x1b[0m', `ProjectPoolFactory contract deployed to ${factoryAddr}`);
    console.log('\x1b[36m%s\x1b[0m', `An example ProjectPool contract was created at address ${poolAddr}`);
}

async function invest() {
    const provider = getProvider('http://localhost:8545');
    const signer = getSigner("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const poolContract = new ethers.Contract(
        "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
        ProjectPoolABI,
        signer
    );

    try {
        const tx = await poolContract.investProject(
            BigInt("9500000000000000000")
        );
        console.debug(`invest response:\n${tx}`);
    } catch (err) {
        console.error(`error when sending invest():\n${err}`);
    }
}

// run().then().catch(err => console.error(err))

async function testXCMOracle() {
    const provider = getProvider('');
    const signer = getSigner("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const poolContract = new ethers.Contract(
        "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
        ProjectPoolABI,
        signer
    );

    try {
        const tx = await poolContract.investProject(
            BigInt("9500000000000000000")
        );
        console.debug(`invest response:\n${tx}`);
    } catch (err) {
        console.error(`error when sending invest():\n${err}`);
    }

}


// invest().then().catch();