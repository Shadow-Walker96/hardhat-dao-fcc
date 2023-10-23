import { ethers, network } from "hardhat"
import {
    FUNC,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
    MIN_DELAY,
    developmentChains,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

export async function queueAndExecute() {
    const args = [NEW_STORE_VALUE]
    const functionToCall = FUNC
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)

    // Hashing the description will save gas 
    // Also the function is from --> governor.queue(..., bytes32 descriptionHash)
    // From OpenZeppelin Contracts v4.4.1 (governance/extensions/GovernorTimelockControl.sol)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

    const governor = await ethers.getContract("GovernorContract")
    console.log("Queueing...................")

    // governor.queue --> Function to queue a proposal to the timelock.
    const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    console.log("Executing.................")

    // From OpenZeppelin Contracts v4.4.1 (governance/Governor.sol)
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)
    const boxNewValue = await box.retrieve()
    console.log(boxNewValue.toString())
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })


// yarn hardhat run scripts/queue-and-execute.ts --network localhost
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat run scripts/queue-and-execute.ts --network localhost
// No need to generate any newer typings.
// Queueing...................
// Moving blocks...
// Moved forward in time 3601 seconds
// Moving blocks............
// Moved 1 blocks
// Executing.................
// 77
// Done in 71.80s.
