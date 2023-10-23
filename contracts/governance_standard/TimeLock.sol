// This contract is going to be an additional contract that is actually the owner.  
// The GovernanceContract and TimeLock are actually the same. 
// So the TimeLock is actually going to be the onwer of the Box.sol Contract.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
  // minDelay is how long you have to wait before executing
  // proposers is the list of addresses that can propose
  // executors is the list of addresses that can execute
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(minDelay, proposers, executors) {}
}


// yarn hardhat compile
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat compile
// Compiling 32 files with 0.8.9
// Solidity compilation finished successfully
// Done in 56.30s.