// const Contract = require('web3-eth-contract');
// const bluebird = require('bluebird'); // eslint-disable-line no-global-assign
// const redis = require("redis");
// const Web3 = require('web3')
// const {redisUrl, leofiCfg, contractParams} = require("../config/vars");
// let redisClient = redis.createClient(redisUrl);
// bluebird.promisifyAll(redis);

// //contract config 
// const {setAdminToken} = require('./token.service')
// const orderAbi = require("../abi/orderAbi.json");
// const orderByteCode = require('../abi/orderByteCode.json');
// const {provider, contractProvider} = require('../utils/provider')

// const web3 = new Web3(leofiCfg.providerUrl)

// Contract.setProvider(provider)

// const depositOrder = async(req) =>{
//     let contract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(leofiCfg.contractOwnerAddr)
//     try {
//         let receipt = await contract.methods.depositOrder(req.owner).send(Object.assign(contractParams, {nonce: nonce}));
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

// exports.createOrder = async (req) =>{
//     // let contract = new Contract(orderAbi, orderContractAddress);
//     //set key - orderaddress 
//     let deployContract = new web3.eth.Contract(orderAbi)
//     let payload = {
//         data: orderByteCode.object,
//         arguments: [
//             leofiCfg.contractOwnerAddr, //fee wallet address
//             [req.portfolioId,req.symbol,req.side,0,0,0,0,req.amount,0,0,req.duration], //order info
//             req.owner, //trader set owner of order
//             leofiCfg.leofiPriceFeedAddress // priceFeed address
//         ]
//     }
//     let deployTx =deployContract.deploy(payload)
//     const createTransaction = await web3.eth.accounts.signTransaction(
//         {
//            from: leofiCfg.contractOwnerAddr,
//            data: deployTx.encodeABI(),
//            gas: 5000000,
//            gasPrice: contractParams.gasPrice,
//            value: web3.utils.toWei(JSON.stringify(req.amount), 'ether')
//         },
//         leofiCfg.contractOwnerPriv
//     );
//     const createReceipt = await web3.eth.sendSignedTransaction(
//         createTransaction.rawTransaction
//     );
//     console.log('Contract deployed at address', createReceipt.contractAddress);
//     let orderInfo = {
//         orderId: createReceipt.contractAddress,
//         symbol: req.symbol,
//         createdAt: Date.now(),
//         status: 0
//     }
//     if(orderInfo.orderId == ''){
//         return 'Error missing orderId'
//     }
//     let request = {
//         orderContractAddress: createReceipt.contractAddress,
//         owner: req.owner,
//         admin: createReceipt.contractAddress,
//     }

//     let respSetAdmin = await setAdminToken(request)
//     console.log("Resp set admin token: ", respSetAdmin.transactionHash, " -s: ", respSetAdmin.status)

//     let receipt = await redisClient.zadd(req.portfolioId, req.score, JSON.stringify(orderInfo));
//     return receipt
// }

// exports.setPriceOrder = async (req) => {
//     let orderContract = new Contract(orderAbi, req.orderContractAddress);
//     let nonce = await getNonce(leofiCfg.contractOwnerAddr)
//     try {
//         let receipt = await orderContract.methods.setPriceOrder(req.price, req.symbol).send(Object.assign(contractParams, {nonce: nonce}));
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

// exports.scanPendingOrder = async (req) =>{
//     let listOrder = await redisClient.zrangeAsync(req, 0, -1);
//     return listOrder
// }

// exports.addWhiteListAddress = async(req) =>{
//     let orderContract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(req.adminAddress)
//     try {
//         let receipt = await orderContract.methods.addWhiteListAddress(req.adminAddress).send(Object.assign(contractParams, {nonce: nonce}))
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

// exports.claimProfit = async(req) =>{
//     let orderContract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(leofiCfg.contractOwnerAddr)
//     try {
//         let receipt = await orderContract.methods.claimProfit(req.sender, req.amount).send(Object.assign(contractParams, {nonce: nonce}))
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

// exports.payToPool = async(req) =>{
//     let orderContract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(leofiCfg.contractOwnerAddr)
//     try {
//         let receipt = await orderContract.methods.payToPool(req.amount).send(Object.assign(contractParams, {nonce: nonce}))
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }

// exports.confirmResult = async(req) =>{
//     let orderContract = new contractProvider(orderAbi, req.orderContractAddress)
//     let nonce = await getNonce(leofiCfg.contractOwnerAddr)
//     let price = await getLatestPrice(req.symbol)
//     //get order info 
//     let orderInfo
//     try {
//         orderInfo = await orderContract.methods.getOrderInfo(req.orderContractAddress).call();
//     } catch (err) {
//         return err.message
//     }

//     console.log("Duration: ", Date.now() - orderInfo.openAt, " -n: ", Date.now(), " -open: ", orderInfo.openAt)

//     try {
//         let receipt = await orderContract.methods.confirmResult(price[0], parseInt(Date.now()/1000), orderInfo.amount).send(Object.assign(contractParams, {nonce: nonce}))
//         console.log("Confirm txHash: ", receipt.transactionHash)
//         return receipt
//     } catch (err) {
//         return err.message
//     }
// }