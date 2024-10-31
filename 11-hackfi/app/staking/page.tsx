"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Watting from '@/assets/quby-cute.gif';
import styles from './staking.module.css';
import { useAccount, useChainId, useWriteContract } from 'wagmi';
import { nftAbi } from '@/components/nft-abi';
import { BLOCK_EXPLORER_BAOBAB, BLOCK_EXPLORER_CYPRESS, CHAINID, CONTRACT_NFT_ADDRESS_BAOBAB, CONTRACT_NFT_ADDRESS_CYPRESS, CONTRACT_STAKE_ADDRESS_BAOBAB, CONTRACT_STAKE_ADDRESS_CYPRESS, TOKEN_ADDRESS_BAOBAB, TOKEN_ADDRESS_CYPRESS } from '@/components/contract';
import { config } from '../config';
import { stakeAbi } from '@/components/stake-abi';
import { readContract } from '@wagmi/core';
import { erc20Abi } from '@/components/erc20-abi';
import heatsFires from '@/assets/heats-fires.gif';
import Guns from '@/assets/two-guns.png'

// Định nghĩa số thập phân của token
const TOKEN_DECIMALS = 18; // Thay đổi giá trị này theo đúng số thập phân của token của bạn

const StakingPage: React.FC = () => {
  const account = useAccount();
  const chainId = useChainId();
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  
  let stakeAddress: `0x${string}`;
  let tokenAddress: `0x${string}`;
  let blockexplorer: string;

  switch (chainId) {
    case CHAINID.BAOBAB:
      stakeAddress = CONTRACT_STAKE_ADDRESS_BAOBAB;
      tokenAddress = TOKEN_ADDRESS_BAOBAB;
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;
    case CHAINID.CYPRESS:
      stakeAddress = CONTRACT_STAKE_ADDRESS_CYPRESS;
      tokenAddress = TOKEN_ADDRESS_CYPRESS;
      blockexplorer = BLOCK_EXPLORER_CYPRESS;
      break;
    default:
      throw new Error("Network not supported");
  }
  
  const { data: hash, writeContract } = useWriteContract();

  useEffect(() => {
    const fetchStakedAmount = async () => {
      if (account.address) {
        try {
          const totalUserStaked = await readContract(config, {
            abi: stakeAbi,
            address: stakeAddress,
            functionName: 'getStaked',
            args: [account.address],
          });

          const totalRewards = await readContract(config, {
            abi: stakeAbi,
            address: stakeAddress,
            functionName: 'getTotalRewards',
            args: [],
          });

          const totalStaked = await readContract(config, {
            abi: stakeAbi,
            address: stakeAddress,
            functionName: 'getTotalStaked',
            args: [],
          });

          const rewardOfUser = Number(totalRewards * totalUserStaked / totalStaked) / Math.pow(10, TOKEN_DECIMALS);

          setRewardAmount(rewardOfUser);

          setStakedAmount(Number(totalUserStaked) / Math.pow(10, TOKEN_DECIMALS));
        } catch (error) {
          console.error("Error fetching staked amount:", error);
        }
      }
    };

    if (account.address) {
      fetchStakedAmount();
    }
  }, [account.address, stakeAddress]);

  const handleApprove = async () => {
    const amount = parseFloat(stakeAmount);
    await writeContract({
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "approve",
      args: [stakeAddress, BigInt(amount) * BigInt(1e18)],
    });
    // Cập nhật lại số lượng đã stake sau khi thực hiện unstaking
    if (account.address) { // Check if addressFound is not empty
      console.log(account.address);
      const totalUserStaked = await readContract(config, {
        abi: stakeAbi,
        address: stakeAddress,
        functionName: 'getStaked',
        args: [account.address],
      });
      setStakedAmount(Number(totalUserStaked) / Math.pow(10, TOKEN_DECIMALS));
    }
  };

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount);
    await writeContract({
      abi: stakeAbi,
      address: stakeAddress,
      functionName: "stake",
      args: [BigInt(amount) * BigInt(1e18)],
    });

    // Cập nhật lại số lượng đã stake sau khi thực hiện unstaking
    if (account.address) { // Check if addressFound is not empty
      console.log(account.address);
      const totalUserStaked = await readContract(config, {
        abi: stakeAbi,
        address: stakeAddress,
        functionName: 'getStaked',
        args: [account.address],
      });
      setStakedAmount(Number(totalUserStaked) / Math.pow(10, TOKEN_DECIMALS));
    }
  };

  const handleUnstake = async () => {
    await writeContract({
      abi: stakeAbi,
      address: stakeAddress,
      functionName: "unstake",
      args: [],
    });

    // Cập nhật lại số lượng đã stake sau khi thực hiện unstaking
    if (account.address) { // Check if addressFound is not empty
      console.log(account.address);
      const totalUserStaked = await readContract(config, {
        abi: stakeAbi,
        address: stakeAddress,
        functionName: 'getStaked',
        args: [account.address],
      });
      setStakedAmount(Number(totalUserStaked) / Math.pow(10, TOKEN_DECIMALS));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center">
          <Image src={heatsFires} alt="Heats Fires" width={350} height={350} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Staking HackFi Token Now !!!</h1>
        <p className="text-xl mb-4">Hackers will not be able to stand it and will immediately return the money to the pool!</p>
        
        <div className="flex flex-col space-y-4 max-w-sm mx-auto">
          <div className="flex items-center">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Nhập số lượng để stake"
              className="flex-grow p-2 border rounded"
            />
            <button onClick={handleApprove} className="ml-2 p-2 bg-blue-500 text-white rounded whitespace-nowrap">
              Approve
            </button>
          </div>
          
          <div className="flex items-center">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Nhập số lượng để stake"
              className="flex-grow p-2 border rounded"
            />
            <button onClick={handleStake} className="ml-2 p-2 bg-blue-500 text-white rounded whitespace-nowrap">
              Stake
            </button>
          </div>

          <button onClick={handleUnstake} className="w-full p-2 bg-red-500 text-white rounded text-lg font-semibold">
            Unstake
          </button>
        </div>

        <div className="text-lg">
          <p>
            Staked Amount: {stakedAmount} HackFi Tokens 
            <img src={Guns.src} alt="Description" className="inline-block w-6 h-6 ml-2" />
          </p>
          <p>
            Current Rewards: {rewardAmount} HackFi Tokens
            <img src={Guns.src} alt="Description" className="inline-block w-6 h-6 ml-2" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
