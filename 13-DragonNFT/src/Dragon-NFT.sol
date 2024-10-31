// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title SoulBound_Ranking_NFT
 * @dev This contract deploys an ERC721 token with additional features such as URI storage and controlled burning.
 *      It is designed to represent SoulBound_Ranking NFTs. Only allows burning through specific functions.
 */
contract SoulBound_Ranking_NFT is ERC721, ERC721URIStorage, ERC721Burnable {
    uint256 private _tokenId;

    mapping(address => uint256[]) public _tokenIdOwned;
    mapping(address => string[]) public _code_contributors;

    mapping(uint256 => string) public _tokenIdOwned_code_contributor;
    mapping(uint256 => address) public _tokenIdOwned_addressMinter;
    mapping(uint256 => uint256) public _tokenIdOwned_level;

    mapping(uint256 => string) public _level_uri;

    // Mapping to store the address of the person who minted the NFT for each tokenId
    mapping(uint256 => address) private _minters;

    // Add a new state variable to store the amount of reward for each tokenId
    mapping(uint256 => uint256) private _tokenRewards;

    // Change mapping to store URI for each code_contributor and level
    mapping(bytes32 => mapping(uint256 => string)) private _contributorLevelUri;

    constructor() ERC721("SoulBound_Ranking_NFT", "SoulBound_Ranking_NFT") {
        _tokenId = 0;
    }

    /**
     * @dev Mint a new token with URI and assign it to a specific address.
     * @param to The address that the token will be minted to.
     * @param uri The address that the token will be minted to.
     * @param level The address that the token will be minted to.
     * @param code_contribute Code Contribute for NFT
     */
    function mint_SoulBound_Ranking_NFT(
        address to,
        string memory uri,
        uint256 level,
        string memory code_contribute
    )
        public
    {
        uint256 tokenId = _tokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokenLevel(tokenId, level);
        _setTokenCodeContribute(tokenId, code_contribute);

        _code_contributors[msg.sender].push(code_contribute);
        _tokenIdOwned[to].push(tokenId);

        // Store the address of the person who minted
        _minters[tokenId] = msg.sender;
    }

    /**
     * @dev Set level for tokenId.
     * @param tokenId Token ID of the NFT.
     * @param level Level to set for the token.
     */
    function _setTokenLevel(uint256 tokenId, uint256 level) internal {
        _tokenIdOwned_level[tokenId] = level;
    }

    /**
     * @dev Set code contribute for tokenId.
     * @param tokenId Token ID of the NFT.
     * @param code_contribute Code Contribute to set for the token.
     */
    function _setTokenCodeContribute(uint256 tokenId, string memory code_contribute) internal {
        _tokenIdOwned_code_contributor[tokenId] = code_contribute;
    }

    /**
     * @dev Set URI for tokenId.
     * @param tokenId Token ID of the NFT.
     * @param level Level to set for the token.
     * @param uri New URI to set for the token.
     */
    function _setUriForLevel(uint256 tokenId, uint256 level, string memory uri) internal {
        string memory code_contribute = _tokenIdOwned_code_contributor[tokenId];
        bool isValidContributor = false;
        for (uint256 i = 0; i < _code_contributors[msg.sender].length; i++) {
            if (keccak256(bytes(code_contribute)) == keccak256(bytes(_code_contributors[msg.sender][i]))) {
                isValidContributor = true;
                break;
            }
        }
        require(isValidContributor, "You do not have the right to perform this action");

        // Use keccak256 to create a unique key for each code_contribute
        bytes32 contributeKey = keccak256(bytes(code_contribute));
        _contributorLevelUri[contributeKey][level] = uri;
    }

    /**
     * @dev Override the transferFrom function to prevent token transfer.
     * @param from The address from which the token is transferred.
     * @param to The address to which the token is transferred.
     * @param tokenId The ID of the token being transferred.
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        require(from == address(0), "Error: token transfer is BLOCKED");
        super.transferFrom(from, to, tokenId);
    }

    /**
     * @dev Get the URI for a specific token.
     * @param tokenId The ID of the token for which the URI will be retrieved.
     * @return string URI for the metadata of the token.
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Check if the contract supports a specific interface.
     * @param interfaceId The ID of the interface.
     * @return bool True if the contract supports the specific interface, otherwise returns false.
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Get all SoulBound_Ranking NFTs owned by a specific address.
     * @param owner The address for which SoulBound_Ranking NFTs will be retrieved.
     * @return uint256[] An array of token IDs owned by the specific address.
     */
    function getSoulBound_Ranking_NFTs(address owner) public view returns (uint256[] memory) {
        require(owner != address(0), "Invalid address");
        return _tokenIdOwned[owner];
    }

    /**
     * @dev Burn a specific SoulBound_Ranking NFT.
     * @param owner The address of the NFT owner.
     * @param tokenId The ID of the token to burn.
     */
    function burn_SoulBound_Ranking_NFT(address owner, uint256 tokenId) public {
        require(msg.sender == _minters[tokenId], "Only the minter can burn this NFT");
        require(ownerOf(tokenId) == owner, "The specified owner does not own this token");

        uint256[] storage tokenIds = _tokenIdOwned[owner];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.pop();
                super._burn(tokenId);
                return;
            }
        }
        revert("Token ID not found for the owner");
    }

    /**
     * @dev Burn all SoulBound_Ranking NFTs owned by the specified address.
     * @param owner The address for which SoulBound_Ranking NFTs will be burned.
     */
    function burn_All_SoulBound_Ranking_NFTs(address owner) public {
        uint256[] memory tokenIds = _tokenIdOwned[owner];
        require(tokenIds.length > 0, "The owner does not have any SoulBound_Ranking NFTs");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(msg.sender == _minters[tokenId], "Only the minter can burn these NFTs");
            super._burn(tokenId);
        }

        delete _tokenIdOwned[owner];
    }

    /**
     * @dev Prevent any attempt to burn tokens from outside by overriding the `burn` function from `ERC721Burnable`.
     * This function does nothing and will revert if called.
     */
    function burn(uint256 /*tokenId*/ ) public pure override(ERC721Burnable) {
        revert("Error: Direct burning is not allowed");
    }

    /**
     * @dev Get the level for a specific tokenId.
     * @param tokenId The ID of the NFT token.
     * @return uint256 The level of the token.
     */
    function getTokenLevel(uint256 tokenId) public view returns (uint256) {
        return _tokenIdOwned_level[tokenId];
    }

    /**
     * @dev Get the code contribute for a specific tokenId.
     * @param tokenId The ID of the NFT token.
     * @return code_contributor The code contribute of the token.
     */
    function getTokenCodeContribute(uint256 tokenId) public view returns (string memory) {
        return _tokenIdOwned_code_contributor[tokenId];
    }

    /**
     * @dev Set level for a tokenId.
     * @param tokenId The ID of the NFT token.
     * @param newUri The new URI to set for the token.
     */
    function replayURI(uint256 tokenId, string memory newUri) public {
        require(msg.sender == _minters[tokenId], "Only the minting person can replay URI");
        _setTokenURI(tokenId, newUri);
    }

    /**
     * @dev Set level for a tokenId.
     * @param tokenId The ID of the NFT token.
     * @param newLevel The new level to set for the token.
     */
    function replayLevel(uint256 tokenId, uint256 newLevel) public {
        require(msg.sender == _minters[tokenId], "Only the minting person can replay level");
        _setTokenLevel(tokenId, newLevel);
    }

    /**
     * @dev Set code contribute for a tokenId.
     * @param tokenId The ID of the NFT token.
     * @param newCodeContribute The new code contribute to set for the token.
     */
    function replayCodeContribute(uint256 tokenId, string memory newCodeContribute) public {
        require(msg.sender == _minters[tokenId], "Only the minting person can replay code contribute");
        // Remove old code_contribute
        string[] storage contributions = _code_contributors[msg.sender];
        for (uint256 i = 0; i < contributions.length; i++) {
            if (keccak256(bytes(contributions[i])) == keccak256(bytes(_tokenIdOwned_code_contributor[tokenId]))) {
                contributions[i] = contributions[contributions.length - 1];
                contributions.pop();
                break;
            }
        }

        // Add new code_contribute
        _setTokenCodeContribute(tokenId, newCodeContribute);
        _code_contributors[msg.sender].push(newCodeContribute);
    }

    /**
     * @dev Set level for a tokenId.
     * @param tokenId The ID of the NFT token.
     * @param amount Amout reward.
     */
    function rewardByTokenId(uint256 tokenId, uint256 amount) external payable {
        require(msg.value >= amount, "The amount of reward must be greater than the amount");
        address tokenOwner = ownerOf(tokenId);
        require(tokenOwner != address(0), "Token does not exist");
        (bool sent,) = payable(tokenOwner).call{ value: msg.value }("");
        require(sent, "Failed to send reward");
        _tokenRewards[tokenId] += amount;
    }

    /**
     * @dev Distribute rewards for tokens based on code_contribute.
     * @param code_contribute The code contribute of the NFT.
     * @param amount The amount of reward.
     */
    function rewardByCodeContribute(string memory code_contribute, uint256 amount) external payable {
        require(msg.value >= amount, "The amount of reward must be greater than the amount");

        uint256 totalTokens = _tokenId;
        uint256[] memory matchingTokenIds = new uint256[](totalTokens);
        uint256 matchingTokenCount = 0;

        // Find all matching tokens
        for (uint256 i = 0; i < totalTokens; i++) {
            if (keccak256(bytes(_tokenIdOwned_code_contributor[i])) == keccak256(bytes(code_contribute))) {
                matchingTokenIds[matchingTokenCount] = i;
                matchingTokenCount++;
            }
        }

        require(matchingTokenCount > 0, "No matching token found for the given code_contribute");

        uint256 rewardPerToken = msg.value / matchingTokenCount;

        // Distribute rewards for matching tokens
        for (uint256 i = 0; i < matchingTokenCount; i++) {
            uint256 tokenId = matchingTokenIds[i];
            address tokenOwner = ownerOf(tokenId);
            (bool sent,) = payable(tokenOwner).call{ value: rewardPerToken }("");
            require(sent, "Failed to send reward");
            _tokenRewards[tokenId] += rewardPerToken;
        }

        // Refund the remaining amount (if any) to the sender
        uint256 remainingAmount = msg.value - (rewardPerToken * matchingTokenCount);
        if (remainingAmount > 0) {
            (bool refundSent,) = payable(msg.sender).call{ value: remainingAmount }("");
            require(refundSent, "Failed to refund the remaining amount");
        }
    }

    /**
     * @dev Get the reward for a specific tokenId.
     * @param tokenId The ID of the NFT token.
     * @return _tokenRewards[tokenId] The amount of reward for the tokenId.
     */
    function getReward(uint256 tokenId) public view returns (uint256) {
        return _tokenRewards[tokenId];
    }

    /**
     * @dev Get the reward for a specific tokenId.
     * @param code_contribute The code contribute of the NFT.
     * @param level The level of the NFT.
     * @return uri The current URI of the NFT.
     */
    function getUriForContributorAndLevel(
        string memory code_contribute,
        uint256 level
    )
        public
        view
        returns (string memory)
    {
        bytes32 contributeKey = keccak256(bytes(code_contribute));
        return _contributorLevelUri[contributeKey][level];
    }

    /**
     * @dev Upgrade the level of the NFT.
     * @param tokenId The ID of the NFT token to be upgraded.
     * @param newLevel The new level for the NFT.
     */
    function upgradeNFTLevel(uint256 tokenId, uint256 newLevel) public {
        require(msg.sender == _minters[tokenId], "Only the minting person can upgrade the NFT");
        require(newLevel > _tokenIdOwned_level[tokenId], "The new level must be higher than the current level");

        _tokenIdOwned_level[tokenId] = newLevel;

        // Update URI if needed
        string memory code_contribute = _tokenIdOwned_code_contributor[tokenId];
        bytes32 contributeKey = keccak256(bytes(code_contribute));
        string memory newUri = _contributorLevelUri[contributeKey][newLevel];
        if (bytes(newUri).length > 0) {
            _setTokenURI(tokenId, newUri);
        }
    }
}
