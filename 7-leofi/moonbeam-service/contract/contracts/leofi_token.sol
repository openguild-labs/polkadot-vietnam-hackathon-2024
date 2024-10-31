// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

contract LeoFiToken is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PausableUpgradeable, OwnableUpgradeable, ERC20PermitUpgradeable, ERC20VotesUpgradeable, SafeMath {
    address[] public whiteListAddress;
    mapping(address => bool) isAdmin; 
    mapping(address => uint) balances;
    mapping(string => uint) user_balance;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        // _disableInitializers();

        whiteListAddress.push(msg.sender);
        isAdmin[msg.sender] = true;
    }

    function addWhiteListAddress(address _admin) public onlyOwner{
        whiteListAddress.push(_admin);
        isAdmin[_admin] = true;
    }

    modifier onlyAdmin(){
        require(isAdmin[msg.sender] == true, "Invalid admin token contract");
        _;
    }

    function initialize(address initialOwner) initializer public {
        __ERC20_init("LeoFi", "WEF");
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __Ownable_init(initialOwner);
        __ERC20Permit_init("LeoFi");
        __ERC20Votes_init();

        uint total_supply = 1000000000 * 10 ** decimals();
        _mint(msg.sender, total_supply);
        balances[msg.sender] = total_supply;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount, string calldata user) public onlyOwner {
        _mint(to, amount);

        user_balance[user] = amount;
    }

    function vault_transfer(address to, uint256 amount, string calldata user) external  onlyOwner{
        transfer(to, amount);

        user_balance[user] +=amount;
    }

    function sync_profit(string calldata user, address investor) external onlyOwner{
        uint256 balance = balanceOf(investor);
        user_balance[user] = balance;
    }

    function get_user_balance(string calldata user) external view returns(uint256){
        return  user_balance[user];
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable, ERC20VotesUpgradeable)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20PermitUpgradeable, NoncesUpgradeable)
        returns (uint256)
    {
        return super.nonces(owner);
    }

    function adminTransferFrom(address from, address to, uint amount, string calldata user) external onlyAdmin returns(bool success){
        balances[from] = safeSub(balances[from], amount);
        balances[to] = safeAdd(balances[to], amount);
        emit Transfer(from, to, amount);

        user_balance[user] += amount;
        return true;
    }
}