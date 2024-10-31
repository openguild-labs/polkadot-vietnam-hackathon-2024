// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenizedVault is ERC20, Ownable, ReentrancyGuard {
    IERC20 public immutable fundingToken;
    
    uint256 public constant MINIMUM_DEPOSIT = 1e18; // 1 token minimum deposit
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public depositFee = 50; // 0.5% deposit fee
    uint256 public withdrawalFee = 50; // 0.5% withdrawal fee
    
    event Deposit(address indexed user, uint256 fundingTokenAmount, uint256 sharesReceived);
    event Withdraw(address indexed user, uint256 sharesAmount, uint256 fundingTokenReceived);
    event FeesUpdated(uint256 newDepositFee, uint256 newWithdrawalFee);

    constructor(
        address _fundingToken,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        require(_fundingToken != address(0), "Invalid token address");
        fundingToken = IERC20(_fundingToken);
    }

    // Calculate shares to mint for a deposit
    function calculateShares(uint256 amount) public view returns (uint256) {
        uint256 totalSupply = totalSupply();
        if (totalSupply == 0) {
            return amount;
        }
        return (amount * totalSupply) / fundingToken.balanceOf(address(this));
    }

    // Calculate funding tokens to return for shares
    function calculateWithdrawAmount(uint256 shares) public view returns (uint256) {
        uint256 totalSupply = totalSupply();
        require(totalSupply > 0, "No shares exist");
        return (shares * fundingToken.balanceOf(address(this))) / totalSupply;
    }

    // Deposit funding tokens and receive shares
    function deposit(uint256 amount) external nonReentrant {
        require(amount >= MINIMUM_DEPOSIT, "Deposit too small");
        
        uint256 fee = (amount * depositFee) / FEE_DENOMINATOR;
        uint256 depositAmount = amount - fee;
        
        require(fundingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        uint256 shares = calculateShares(depositAmount);
        _mint(msg.sender, shares);
        
        emit Deposit(msg.sender, amount, shares);
    }

    // Withdraw by burning shares
    function withdraw(uint256 shares) external nonReentrant {
        require(shares > 0, "Cannot withdraw 0 shares");
        require(balanceOf(msg.sender) >= shares, "Insufficient shares");
        
        uint256 amount = calculateWithdrawAmount(shares);
        uint256 fee = (amount * withdrawalFee) / FEE_DENOMINATOR;
        uint256 withdrawAmount = amount - fee;
        
        _burn(msg.sender, shares);
        require(fundingToken.transfer(msg.sender, withdrawAmount), "Transfer failed");
        
        emit Withdraw(msg.sender, shares, withdrawAmount);
    }

    // Admin functions
    function updateFees(uint256 _depositFee, uint256 _withdrawalFee) external onlyOwner {
        require(_depositFee <= 500 && _withdrawalFee <= 500, "Fees too high"); // Max 5%
        depositFee = _depositFee;
        withdrawalFee = _withdrawalFee;
        emit FeesUpdated(_depositFee, _withdrawalFee);
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = fundingToken.balanceOf(address(this));
        require(fundingToken.transfer(owner(), balance), "Transfer failed");
    }

    // View functions
    function getVaultBalance() external view returns (uint256) {
        return fundingToken.balanceOf(address(this));
    }
}