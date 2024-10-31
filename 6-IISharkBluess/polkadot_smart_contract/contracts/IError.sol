// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IError {
    /**
     * @dev sender is not owner of smart contract
     */
    error IsNotOwner();

    /**
     * @dev sender is pool's creator
     */
    error IsCreator();

    /**
     * @dev is not enough token to send
     */
    error Isinsufficient();

    /**
     * @dev is not exist pool
     */
    error IsNotExistPool();

    /**
     * @dev pool is not ending
     */
    error IsNotEndingPool();
    
    /**
     * @dev pool is not ending
     */
    error PoolIsBorrowed();

    /**
     * @dev sender is not pool's borrower
     */
    error IsNotBorrower();
}
