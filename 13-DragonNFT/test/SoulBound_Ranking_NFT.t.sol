// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/Dragon-NFT.sol";

contract TestSoulBoundRankingNFT {
    SoulBound_Ranking_NFT private nftContract;

    constructor() {
        nftContract = new SoulBound_Ranking_NFT();
    }

    function testMintNFT(address to, string memory uri, uint256 level, string memory code_contribute) public {
        nftContract.mint_SoulBound_Ranking_NFT(to, uri, level, code_contribute);
    }

    function testGetSoulBoundRankings(address owner) public view returns (uint256[] memory) {
        return nftContract.getSoulBound_Ranking_NFTs(owner);
    }

    function testBurnNFT(uint256 tokenId) public {
        address owner = nftContract.ownerOf(tokenId);
        nftContract.burn_SoulBound_Ranking_NFT(owner, tokenId);
    }

    function testGetTokenLevel(uint256 tokenId) public view returns (uint256) {
        return nftContract.getTokenLevel(tokenId);
    }

    function testGetTokenCodeContribute(uint256 tokenId) public view returns (string memory) {
        return nftContract.getTokenCodeContribute(tokenId);
    }

    function testRewardByTokenId(uint256 tokenId, uint256 amount) public payable {
        nftContract.rewardByTokenId{value: msg.value}(tokenId, amount);
    }

    function testGetReward(uint256 tokenId) public view returns (uint256) {
        return nftContract.getReward(tokenId);
    }
}