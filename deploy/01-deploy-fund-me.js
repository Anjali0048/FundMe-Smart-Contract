const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config();

// function deployFun(hre) {
//     console.log("HI")
// }
// module.exports.default = deployFun

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre;
//     // or hre.getNamedAccounts; 
//     // hre.deployments
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId

    // if chainId is X use address Y
    // if chainId is Z use address A

    let ethUsdPriceFeedAddress  
    if(developmentChains.includes(network.name)) {
        const ethUsdAggregrator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregrator.address
    }
    else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the contract doesn't exist, we deploy a minimal version of for our local testing

    // when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1
    })

    // if its not a development chain then we are gonna verify it
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }
    log("----------------------------------------------------------")
}

module.exports.tags = ["all","fundme"]
