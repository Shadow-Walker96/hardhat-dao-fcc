import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    log("Deploying GovernanceToken and waiting for confirmations..............")

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`GovernanceToken at ${governanceToken.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governanceToken.address, [])
    }

    log(`Delegating to ${deployer}`)
    await delegate(governanceToken.address, deployer)
    log("Delegated!")
}

// Here when we deploy this contract i.e GovernanceToken, nobody has voting power yet and the reason
// is bcos nobody has the token delegated to them yet 
// So we want to delegate the GovernanceToken to our Deployer
const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const tx = await governanceToken.delegate(delegatedAccount)
    await tx.wait(1)

    // Get number of checkpoints for `account`.
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

export default deployGovernanceToken

deployGovernanceToken.tags = ["all", "governor"]

// yarn hardhat deploy
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat deploy
// Compiling 1 file with 0.8.9
// Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v5
// Successfully generated 5 typings!
// Solidity compilation finished successfully
// ----------------------------------------------------
// Deploying GovernanceToken and waiting for confirmations..............
// deploying "GovernanceToken" (tx: 0x003948bf6bc72a8326980fed2945861b179582526c26ee510c6396f969bb2e1c)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 3396187 gas
// GovernanceToken at 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Delegating to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Checkpoints: 1
// Delegated!
// Done in 124.67s.

