// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {UtilsTest} from "./Utils.t.sol";
import {Safe} from "../src/Safe.sol";

contract SafeProxyFactoryTest is UtilsTest {
    address[] listOfOwners;

    function setUp() public override {
        super.setUp();

        for (uint256 i = 0; i < 10; i++) {
            string memory label = string(
                abi.encodePacked("owner", vm.toString(i))
            );
            address owner = makeAddr(label);

            listOfOwners.push(owner);
        }
    }

    // creating first smart account
    function test_deployProxy() public {
        address[] memory account1Owners = new address[](3);
        address[] memory account2Owners = new address[](4);

        for (uint256 i = 0; i < 3; i++) {
            account1Owners[i] = listOfOwners[i];
        }
        for (uint256 i = 0; i < 4; i++) {
            account2Owners[i] = listOfOwners[i];
        }

        Safe account1 = createSmartAccount(account1Owners, 2); // first account
        Safe account2 = createSmartAccount(account2Owners, 3); // second account

        account1.getOwners();
        account2.getOwners();
        assertEq(account1.getThreshold(), 2);
        assertEq(account2.getThreshold(), 3);
    }

    function createSmartAccount(
        address[] memory owners,
        uint256 threshold
    ) internal returns (Safe) {
        bytes memory initializer = abi.encodeWithSignature(
            "setup(address[],uint256,address,bytes,address,address,uint256,address)",
            owners,
            threshold,
            address(0),
            bytes(""),
            address(fallbackHandler),
            address(0),
            0,
            address(0)
        );

        proxy = proxyFactory.createProxyWithNonce(
            address(singletonSafe),
            initializer,
            10
        );

        Safe account = Safe(payable(address(proxy))); // typecasted interface

        return account;
    }
}
