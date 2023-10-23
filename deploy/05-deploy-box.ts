import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying Box and waiting for confirmations...")
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`Box at ${box.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(box.address, [])
    }
    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferTx = await boxContract.transferOwnership(timeLock.address)
    await transferTx.wait(1)
    log("You Done It.........................")
}

export default deployBox

deployBox.tags = ["all", "box"]

// yarn hardhat deploy
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat deploy
// Nothing to compile
// No need to generate any newer typings.
// ----------------------------------------------------
// Deploying GovernanceToken and waiting for confirmations..............
// deploying "GovernanceToken" (tx: 0x003948bf6bc72a8326980fed2945861b179582526c26ee510c6396f969bb2e1c)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 3396187 gas
// GovernanceToken at 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Delegating to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Checkpoints: 1
// Delegated!
// ----------------------------------------------------
// Deploying TimeLock and waiting for confirmations...
// deploying "TimeLock" (tx: 0x335cd362d8f055b21cb4a5a11a4093c1b1cfc5714f2580a94560ac1f73516f02)...: deployed at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 with 2684072 gas
// TimeLock at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// Deploying governor
// ----------------------------------------------------
// Deploying GovernorContract and waiting for confirmations...
// deploying "GovernorContract" (tx: 0x0c55336890ddd50a2bff1c59b452a7c307b54ddff918650c03d9625cad246034)...: deployed at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 with 4218291 gas
// GovernorContract at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
// ----------------------------------------------------
// Setting up contracts for roles............
// ----------------------------------------------------
// Deploying Box and waiting for confirmations...
// deploying "Box" (tx: 0x63ebc296091eb03876ba905b1ab7f7735ead9a0108aa2bc2ae59db856f42cd95)...: deployed at 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 with 445808 gas
// Box at 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
// You Done It.........................
// Done in 54.48s.
