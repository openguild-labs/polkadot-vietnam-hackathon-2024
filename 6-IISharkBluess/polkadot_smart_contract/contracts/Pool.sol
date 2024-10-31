// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "./IError.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ETHPool is IError {
    using SafeERC20 for IERC20;
    enum PoolStatus {PENDING, STARTING, ENDING}
    enum LiquidationType {DEPOSITE, REPAY}
    address owner;

    constructor() {
        owner = msg.sender;
    }

    struct PairToken {
        address lendToken;
        address collateralToken;
        uint256 lendAmount;
    }

    struct Pool {
        uint8 pairId;
        string name;
        address lender;
        address borrower;
        uint256 collateral_amount;
        uint256 expire;
        uint256 profit;
        bool isDeleted;
        PoolStatus pool_status;
    }

    struct NewPool {
        uint8 pairId;
        string name;
        uint256 collateral_amount;
        uint256 expire;
        uint256 profit;
    }

    PairToken[] public pairTokenList;
    Pool[] public poolList;

    mapping (address => mapping (address => uint256)) public ownBalances; 

    modifier isNotExistPool(uint8 poolIndex) {
        if (poolIndex < 0 || poolIndex >= poolList.length) {
            revert IsNotExistPool();
        }
        _;
    }

    modifier isNotBorrower(address borrower) {
         if (msg.sender != borrower) {
            revert IsNotBorrower();
        }
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert IsNotOwner();
        }
        _;
    }


    event CreatePairToken(PairToken pair);
    event CreatePool(Pool pool);
    event Borrow(uint8 indexed poolIndex, Pool pool);
    event EditPool(uint8 indexed poolIndex, Pool pool);
    event CancelPool(uint8 indexed poolIndex, bool isDeleted);
    event Repay(uint8 indexed poolIndex,uint256 balance);
    event WithdrawColateral(address token, uint256 amount, uint256 balance);
    event Liquidation(uint8 indexed poolIndex, LiquidationType healthRatioStatus, uint32[2] tokenPrice);

    function createPairToken (PairToken memory pair) public onlyOwner {
        pairTokenList.push(pair);

        emit CreatePairToken(pair);
    }

    function getDetailPair (uint8 index) public view returns (PairToken memory) {
        return pairTokenList[index];
    } 

    function createPool(       
        NewPool calldata newPool
    ) public {

        poolList.push(Pool(
            newPool.pairId,
            newPool.name,
            msg.sender,
            address(0),
            newPool.collateral_amount,
            newPool.expire,
            newPool.profit,
            false,
            PoolStatus.PENDING
        ));

        emit CreatePool(poolList[poolList.length - 1]);
    }

    function borrow(uint8 poolIndex, uint256 estimated_collateral_amount) public {
        Pool storage pool = poolList[poolIndex];
        address lender = pool.lender;
        address collateral_token = pairTokenList[pool.pairId].collateralToken;
        address lend_token = pairTokenList[pool.pairId].lendToken;
        uint256 balance = IERC20(collateral_token).balanceOf(msg.sender);
        uint256 profit_amount = estimated_collateral_amount * pool.profit / 100;


        if (msg.sender == lender) {
            revert IsCreator();
        }
        if (balance < estimated_collateral_amount) {
            revert Isinsufficient();
        }

        unchecked {
            ownBalances[lender][collateral_token] += estimated_collateral_amount + profit_amount;
            ownBalances[msg.sender][lend_token] += pairTokenList[pool.pairId].lendAmount;
        }

        pool.collateral_amount = estimated_collateral_amount;
        pool.borrower = msg.sender;
        pool.pool_status = PoolStatus.STARTING;

        emit Borrow(poolIndex, pool);
    }

    function deposite (address sender, address token, uint256 amount) public {
        IERC20(token).safeTransferFrom(sender,address(this), amount);
    }

    function editPool(uint8 poolIndex, uint8 profit) public isNotExistPool(poolIndex) {
        Pool storage pool = poolList[poolIndex]; 
        if (pool.pool_status == PoolStatus.STARTING || pool.pool_status == PoolStatus.PENDING) {
            revert PoolIsBorrowed();
        }

        pool.profit = profit;

        emit EditPool(poolIndex, poolList[poolIndex]);
    }

    function cancelPool (uint8 poolIndex) public isNotExistPool(poolIndex) {
        poolList[poolIndex].isDeleted = true;

        emit CancelPool(poolIndex, true);
    }

    function repay(uint8 poolIndex) public isNotExistPool(poolIndex) isNotBorrower(poolList[poolIndex].borrower) {
        Pool storage pool = poolList[poolIndex];
        address lender = pool.lender;
        address borrower = pool.borrower;
        address lend_token = pairTokenList[pool.pairId].lendToken;
        address collateral_token = pairTokenList[pool.pairId].collateralToken;

        unchecked {
            ownBalances[lender][lend_token] += pairTokenList[pool.pairId].lendAmount;
            ownBalances[lender][collateral_token] -= pool.collateral_amount;
            ownBalances[borrower][lend_token] -= pairTokenList[pool.pairId].lendAmount;
            ownBalances[borrower][collateral_token] += pool.collateral_amount;
        }

        poolList[poolIndex].pool_status = PoolStatus.ENDING;

        emit Repay(poolIndex, ownBalances[lender][lend_token] );
    }

    function withdraw(address token, uint256 amount) public {
        if (amount > IERC20(token).balanceOf(msg.sender)) {
            revert Isinsufficient();
        }

        IERC20(token).safeTransfer(msg.sender, amount);

        emit WithdrawColateral(token, amount, IERC20(token).balanceOf(msg.sender));
    }

    function expireLendingTime (uint8 poolIndex) public view isNotExistPool(poolIndex) returns (bool) {
        uint256 expireTime = poolList[poolIndex].expire;
        if (expireTime < block.timestamp) {
            return true;
        }
        return false;
    }
}