"use client"
import React, { useState, useEffect } from 'react';
import Watting from '@/assets/quby-cute.gif';
import styles from './staking.module.css';
import { nftAbi } from '@/components/nft-abi';
import { useAccount, useChainId } from 'wagmi';
import { BLOCK_EXPLORER_BAOBAB, BLOCK_EXPLORER_CYPRESS, CHAINID, CONTRACT_NFT_ADDRESS_BAOBAB, CONTRACT_NFT_ADDRESS_CYPRESS, TOKEN_ADDRESS_BAOBAB, TOKEN_ADDRESS_CYPRESS } from '@/components/contract';
import { config } from '../config';
import { readContract } from '@wagmi/core';
import { Avatar, colors, LeaderboardItem, LeaderboardList, LeaderboardScrollContainer, PlayerInfo, PlayerName, PlayerPoints, Rank } from './super-shit';

const SuperShit: React.FC = () => {
  const [addressFound, setAddressFound] = useState('');
  const [arrayOwnersShitNFT, setArrayOwnersShitNFT] = useState('');
  const [totalOwnerShitNFT, setTotalOwnerShitNFT] = useState(0);
  const account = useAccount();
  const chainId = useChainId();

  let contractAddress: `0x${string}`;
  let tokenAddress: `0x${string}`;
  let blockexplorer: string;

  // Determine contract and token addresses based on the chain ID
  switch (chainId) {
    case CHAINID.BAOBAB:
      contractAddress = CONTRACT_NFT_ADDRESS_BAOBAB;
      tokenAddress = TOKEN_ADDRESS_BAOBAB;
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;
    case CHAINID.CYPRESS:
      contractAddress = CONTRACT_NFT_ADDRESS_CYPRESS;
      tokenAddress = TOKEN_ADDRESS_CYPRESS;
      blockexplorer = BLOCK_EXPLORER_CYPRESS;
      break;
    default:
      throw new Error("Network not supported");
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressFound(event.target.value);
    setTotalOwnerShitNFT(0); // Reset total NFT count when searching
  };

  const fetchTotalOwnerShitNFT = async () => {
    if (account.address && addressFound) { // Check if addressFound is not empty
      const totalNFT = await readContract(config, {
        abi: nftAbi,
        address: contractAddress,
        functionName: 'getShitNFTs',
        args: [addressFound as `0x${string}`],
      });
      setTotalOwnerShitNFT(Number(totalNFT));
    }
  };

  const fetchArrayOwnersShitNFT = async () => {
    if (account.address && addressFound) { // Check if addressFound is not empty
      const ArrayOwnersShitNFT = await readContract(config, {
        abi: nftAbi,
        address: contractAddress,
        functionName: 'getShitArray',
        args: [],
      });
      setArrayOwnersShitNFT(ArrayOwnersShitNFT as unknown as string); // Convert data type
      console.log(ArrayOwnersShitNFT);
    }
  };

  const TopOwners: React.FC = () => {
    const [topOwners, setTopOwners] = useState<{ address: string; totalNFT: number }[]>([]);

    const fetchTopOwners = async () => {
      await fetchArrayOwnersShitNFT(); // Call function to get the list of addresses
      const owners = await readContract(config, {
        abi: nftAbi,
        address: contractAddress,
        functionName: 'getShitArray',
        args: [],
      });

      const uniqueOwners = Array.from(new Set(owners)); // Filter duplicate addresses
      const ownersWithNFTCount = await Promise.all(
        uniqueOwners.map(async (owner: string) => {
          const totalNFT = await readContract(config, {
            abi: nftAbi,
            address: contractAddress,
            functionName: 'getShitNFTs',
            args: [owner as `0x${string}`],
          });
          return { address: owner, totalNFT: Number(totalNFT) };
        })
      );

      // Sort and get the top 10 addresses with the most NFTs
      const sortedOwners = ownersWithNFTCount.sort((a, b) => b.totalNFT - a.totalNFT).slice(0, 10);

      // Ensure there are 10 addresses, if not, replace with "None"
      while (sortedOwners.length < 10) {
        sortedOwners.push({ address: "None", totalNFT: 0 });
      }

      setTopOwners(sortedOwners);
    };

    useEffect(() => {
      fetchTopOwners();
    }, []);

    return (
      <div className={styles.topOwnersContainer}>
        <LeaderboardScrollContainer>
          <LeaderboardList>
            {topOwners.map((owner, index) => (
              <LeaderboardItem
                key={owner.address}
                rank={index + 1}
              >
                <Rank className="text-black">{index + 1}</Rank>
                <Avatar src={`https://robohash.org/${owner.address}`} alt={owner.address} />
                <PlayerInfo>
                  <PlayerName className="text-black">{owner.address}</PlayerName>
                </PlayerInfo>
                <PlayerPoints className="text-black">
                  {owner.totalNFT} SHIT NFT
                  <img src="https://salmon-raw-harrier-526.mypinata.cloud/ipfs/QmNS12GHek4YP3jXsVjDgq3ooqwfxxnfGLA1XmgtA8RfaC" alt="NFT" className="inline-block w-10 h-10" />
                </PlayerPoints>
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        </LeaderboardScrollContainer>
      </div>
    );
  };

  useEffect(() => {
    fetchTotalOwnerShitNFT();
  }, [account.address, contractAddress]);

  const TotalNFTDisplay: React.FC<{ totalNFT: number }> = ({ totalNFT }) => {
    return (
      <div className={styles.topOwnersContainer}>
        <LeaderboardScrollContainer>
          <LeaderboardList>
              <LeaderboardItem
                key={addressFound}
                rank={1}
              >
                <Rank className="text-black">{1}</Rank>
                <Avatar src={`https://robohash.org/${addressFound}`} alt={addressFound} />
                <PlayerInfo>
                  <PlayerName className="text-black">{addressFound}</PlayerName>
                </PlayerInfo>
                <PlayerPoints className="text-black">{totalOwnerShitNFT} SHIT NFT</PlayerPoints>
              </LeaderboardItem>
          </LeaderboardList>
        </LeaderboardScrollContainer>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5 gap-2">
      <div className="text-center flex flex-row items-center gap-5 mt-20">
        <input 
          type="text" 
          value={addressFound} 
          onChange={handleSearchChange} 
          placeholder="Enter address to view" 
          className="p-2 border rounded w-100px bg-white text-black"
        />
        <button onClick={fetchTotalOwnerShitNFT} className="p-2 bg-black text-white rounded w-full max-w-md">
          Search
        </button>
      </div>
      {totalOwnerShitNFT > 0 ? (
        <TotalNFTDisplay totalNFT={totalOwnerShitNFT} />
      ) : (
        <div className={styles.placeholder} />
      )}
      <TopOwners />
    </div>
  );
};

export default SuperShit;
