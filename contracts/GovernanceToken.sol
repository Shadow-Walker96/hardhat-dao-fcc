// 30:02:40 ----------------- How to buid a DAO
// What we will be working with to build this governance platform, we are going to be building
// of it with ERC20 Token standard

// So you are going to get ERC20 Token and that is the token you get to vote.

// Someone knows a hot proposal is coming up
// So they just buy ton of tokens, and then they dump if after
// so we want to make it fair, so to make it Governance
// What we will do is to have a Snapshot of tokens people have at a certain checkpoints
// so we want to make sure that once a purposal goes through, we take a snapshot from the past that
// we want to use. this kind of incentivices people not to jump in into a proposal and jump out
// bcos once a purposal hits, it uses a checkpoint snapshot from the past.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {
  uint256 public s_maxSupply = 1000000000000000000000000;

  constructor() ERC20("GovernanceToken", "GT") ERC20Permit("GovernanceToken") {
    _mint(msg.sender, s_maxSupply);
  }

  // The functions below are overrides required by solidity

  /**
   * @dev Move voting power when tokens are transferred.
   * Anytime we do call _afterTokenTransfer, we want to make sure that 
   * we call the ._afterTokenTransfer of the ERC20Votes i.e "override(ERC20Votes)"
   * The reason why we do this is bcos we want to make sure that the snapshot are updated 
   * We want to make sure we know how many people have, and how many tokens at each checkpoints
   */
  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override(ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  /**
   * @dev Snapshots the totalSupply after it has been increased.
   */
  function _mint(address account, uint256 amount) internal virtual override(ERC20Votes) {
    super._mint(account, amount);
  }

  /**
   * @dev Snapshots the totalSupply after it has been decreased.
   */
  function _burn(address account, uint256 amount) internal virtual override(ERC20Votes) {
    super._burn(account, amount);
  }
}


// yarn hardhat compile
// yarn run v1.22.19
// warning package.json: No license field
// $ /home/shadow-walker/hardhat-dao-fcc/node_modules/.bin/hardhat compile
// Compiling 14 files with 0.8.8
// Solidity compilation finished successfully
// Done in 47.96s.
