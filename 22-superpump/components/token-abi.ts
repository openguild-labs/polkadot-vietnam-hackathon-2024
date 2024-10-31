export const tokenAbi = [
    {
      "type": "function",
      "name": "deploy",
      "inputs": [
        {
          "name": "feeRecipient",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "feeAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "basisFee",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "pumpFun",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "tokenFactory",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "Deployed",
      "inputs": [
        {
          "name": "pumpFun",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "tokenFactory",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    }
]