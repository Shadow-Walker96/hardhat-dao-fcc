// 30:02:40 ----------------- How to buid a DAO
// We make use of the last solidity code from hardhat-upgrade-fcc

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
 
contract Box is Ownable {
    uint256 internal value;
 
    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);
 
    // Stores a new value in the contract
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }
 
    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}

// yarn hardhat compile
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat compile
// Compiling 4 files with 0.8.8
// Solidity compilation finished successfully
// Done in 103.18s.
