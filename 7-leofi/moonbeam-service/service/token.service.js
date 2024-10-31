// const Contract = require('web3-eth-contract');
// const {leofiCfg, contractParams} = require('../config/vars')

// const tokenAbi = require("../abi/tokenAbi.json");
// const {provider} = require('../utils/provider')

// Contract.setProvider(provider)

// exports.setAdminToken = async(req) =>{
//     let contract = new Contract(tokenAbi, leofiCfg.leofiTokenAddress)
//     let nonce = await getNonce(leofiCfg.contractOwnerAddr)
//     try {
//         let receipt = await contract.methods.addWhiteListAddress(req.admin).send(Object.assign(contractParams, {nonce: nonce}))
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }