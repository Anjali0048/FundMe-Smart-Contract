const { network } = require("hardhat");

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

    // when going for localhost or hardhat network we want to use a mock
    
}

