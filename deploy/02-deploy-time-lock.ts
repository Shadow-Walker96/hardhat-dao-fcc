import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify"
import { networkConfig, developmentChains, MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying TimeLock and waiting for confirmations...")
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], []],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`TimeLock at ${timeLock.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
}

export default deployTimeLock

deployTimeLock.tags = ["all", "timelock"]

// yarn hardhat deploy --tags timelock
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat deploy --tags timelock
// Nothing to compile
// No need to generate any newer typings.
// ----------------------------------------------------
// Deploying TimeLock and waiting for confirmations...
// deploying "TimeLock" (tx: 0xe51e6d51c0de96d273e451ae63ddad9ab7581e9ac63f1b29ac15dc5b033aeeca)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 2684072 gas
// TimeLock at 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Done in 52.59s.
