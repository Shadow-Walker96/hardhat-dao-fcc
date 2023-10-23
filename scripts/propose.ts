import { ethers, network } from "hardhat"
import {
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
    FUNC,
    PROPOSAL_DESCRIPTION,
    NEW_STORE_VALUE,
} from "../helper-hardhat-config"
import * as fs from "fs"
import { moveBlocks } from "../utils/move-blocks"

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")

    // "encodedFunctionCall" -> Here we encode our function from the Box.sol contract 
    // i.e function store(uint256 newValue) public onlyOwner {...} and its parameter it will take 
    // We encoded it bcos the parameter, governor.propose(...) takes the calldata of byte32 []
    // i.e function propose(.., bytes[] memory calldatas) 
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)

    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description:\n  ${proposalDescription}`)

    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )

    // If working on a development chain, we will push forward till we get to the voting period.
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }

    const proposeReceipt = await proposeTx.wait(1)
    // We need the proposalId later on to vote
    const proposalId = proposeReceipt.events[0].args.proposalId
    console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    // "proposalState" -> To Know The Current state of a proposal, following Compound's convention
    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)

    // We want to save the proposalId
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    // !--> in typescript means that they will be chainId, to remove the red line 
    // we are storing the proposals by their chainId
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

    console.log(`Current Proposal State: ${proposalState}`)
    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
    console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })


// yarn hardhat run scripts/propose.ts --network localhost
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat run scripts/propose.ts --network localhost
// No need to generate any newer typings.
// Proposing store on 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 with 77
// Proposal Description:
//   Proposal #1 77 in the Box!
// Moving blocks............
// Moved 2 blocks
// Proposed with proposal ID:
//   51508501457481436077634888669578781761098444908194579718864424217340756472817
// Current Proposal State: 1
// Current Proposal Snapshot: 11
// Current Proposal Deadline: 16
// Done in 290.78s.
