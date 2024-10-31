// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../lib/forge-std/src/Script.sol";
import "../src/Dragon-NFT.sol";

contract DeploySoulBoundRankingNFT is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the SoulBound_Ranking_NFT contract
        SoulBound_Ranking_NFT soulBoundRankingNFT = new SoulBound_Ranking_NFT();

        vm.stopBroadcast();
    }
} 