// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";

import {Safe} from "../src/Safe.sol";
import {SingletonFactory} from "../src/SingletonFactory.sol";
import {SafeProxy} from "../src/proxies/SafeProxy.sol";
import {SafeProxyFactory} from "../src/proxies/SafeProxyFactory.sol";
import {CompatibilityFallbackHandler} from "../src/handler/CompatibilityFallbackHandler.sol";

import {ERC20Mock} from "./mocks/ERC20Mock.sol";

abstract contract UtilsTest is Test {
    // deploy proxyFactory , and call deployProxy  function to intialize new proxy for user
    SingletonFactory singletonFactory;

    /*
     The Safe proxy factory contract provides a simple way to create a new proxy contract pointing to a 
     singleton and executing a setup function in the newly deployed proxy all in one transaction.
   */

    SafeProxyFactory proxyFactory;

    SafeProxy proxy;

    Safe singletonSafe; // This is a singleton contract deployed only once and used by Safe Proxy to delegate calls.

    CompatibilityFallbackHandler fallbackHandler; // used inside safe if someone unintended behaviour happens

    ERC20Mock safeToken;

    function setUp() public virtual {
        //  1. Singleton Factory deployment
        singletonFactory = new SingletonFactory();

        //  2. Safe creation code
        bytes memory SafeInitCode = abi.encodePacked(type(Safe).creationCode);
        bytes32 SafeSalt = keccak256(abi.encodePacked("my-safe-singleton"));

        address safeAddress = singletonFactory.deploy(SafeInitCode, SafeSalt);
        singletonSafe = Safe(payable(safeAddress));

        // 3.  Safe Proxy Factory creation code
        bytes memory SafeProxyFactoryInitCode = abi.encodePacked(
            type(SafeProxyFactory).creationCode
        );

        bytes32 SafeProxyFactorySalt = keccak256(
            abi.encodePacked("my-safe-proxy-factory")
        );

        address safeProxyFactoryAddress = singletonFactory.deploy(
            SafeProxyFactoryInitCode,
            SafeProxyFactorySalt
        );

        proxyFactory = SafeProxyFactory(safeProxyFactoryAddress);

        // 4.  CompatibilityFallbackHandler deployment

        bytes memory CompatibilityFallbackHandlerInitCode = abi.encodePacked(
            type(CompatibilityFallbackHandler).creationCode
        );

        bytes32 CompatibilityFallbackHandlerSalt = keccak256(
            abi.encodePacked("my-CompatibilityFallbackHandler")
        );

        address fallbackHandlerAddress = singletonFactory.deploy(
            CompatibilityFallbackHandlerInitCode,
            CompatibilityFallbackHandlerSalt
        );

        fallbackHandler = CompatibilityFallbackHandler(
            payable(fallbackHandlerAddress)
        );

        safeToken = new ERC20Mock();
    }
}
