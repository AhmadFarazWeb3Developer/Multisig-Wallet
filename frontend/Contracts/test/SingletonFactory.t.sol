// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {UtilsTest} from "./Utils.t.sol";

contract SingletonFactoryTest is UtilsTest {
    function setUp() public override {
        super.setUp();
    }

    function test_deploySafeSingleton() public view {
        console.logAddress(address(singletonSafe));
    }

    function test_deploySafeProxyFactory() public view {
        console.logAddress(address(proxyFactory));
    }

    function test_CreatedContracts() public view {
        assertEq(singletonFactory.createdContracts(0), address(singletonSafe));
        assertEq(singletonFactory.createdContracts(1), address(proxyFactory));
    }
}
