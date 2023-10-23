import * as fs from "fs"
import { network, ethers } from "hardhat"
import { proposalsFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"

// Here we just want to grab the first index of our proposals.json 
// i.e from the array {"31337":["51508501457481436077634888669578781761098444908194579718864424217340756472817"]}
//  the first index is 5
const index = 0

async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    // You could swap this out for the ID you want to use too
    // i.e the numbers in
    // the array ["51508501457481436077634888669578781761098444908194579718864424217340756472817"]
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    // 0 = Against, 1 = For, 2 = Abstain for this example
    const voteWay = 1
    const reason = "I lika do da cha cha"
    await vote(proposalId, voteWay, reason)
}

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(proposalId: string, voteWay: number, reason: string) {
    console.log("Voting...")
    const governor = await ethers.getContract("GovernorContract")
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)

    const voteTxReceipt = await voteTx.wait(1)
    console.log(voteTxReceipt.events[0].args.reason)

    const proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }

    console.log("Voted Ready To Go...")
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })


// yarn hardhat run scripts/vote.ts --network localhost
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat run scripts/vote.ts --network localhost
// No need to generate any newer typings.
// Voting...
// I lika do da cha cha
// Current Proposal State: 1
// Moving blocks............
// Moved 6 blocks
// Voted Ready To Go...
// Done in 124.59s.   