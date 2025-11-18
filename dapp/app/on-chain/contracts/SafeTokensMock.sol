// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SafeTokensMock is ERC20 {
    constructor() ERC20("Safe Tokens", "Safw") {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
