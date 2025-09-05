// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {UtilsTest} from "./Utils.t.sol";
import {Safe} from "../src/Safe.sol";
import {Enum} from "../src/libraries/Enum.sol";
import {SimpleGuard} from "../src/SimpleGuard.sol";

contract SafeProxyFactoryTest is UtilsTest {
    address[] listOfOwners;
    uint256[] listOfOwnersPrivateKeys;

    address[] account1OwnersPublicKeys = new address[](3);
    uint256[] account1OwnersPrivateKeys = new uint256[](3);

    address[] account2OwnersPublicKeys = new address[](4);
    uint256[] account2OwnersPrivateKeys = new uint256[](4);

    function setUp() public override {
        super.setUp();

        for (uint256 i = 0; i < 10; i++) {
            string memory label = string(
                abi.encodePacked("owner", vm.toString(i))
            );
            (address owner, uint256 privateKey) = makeAddrAndKey(label);

            listOfOwners.push(owner);
            listOfOwnersPrivateKeys.push(privateKey);
        }

        // first list
        for (uint256 i = 0; i < 3; i++) {
            account1OwnersPublicKeys[i] = listOfOwners[i];
            account1OwnersPrivateKeys[i] = listOfOwnersPrivateKeys[i];
        }
        // second list
        for (uint256 i = 0; i < 4; i++) {
            account2OwnersPublicKeys[i] = listOfOwners[i];
            account2OwnersPrivateKeys[i] = listOfOwnersPrivateKeys[i];
        }
    }

    // creating smart accounts
    function test_deployProxy() public {
        Safe account1 = createSmartAccount(account1OwnersPublicKeys, 2); // first account
        Safe account2 = createSmartAccount(account2OwnersPublicKeys, 3); // second account

        account1.getOwners();
        account2.getOwners();
        assertEq(account1.getThreshold(), 2);
        assertEq(account2.getThreshold(), 3);
    }

    function test_changeThreshold() public {
        Safe account1 = createSmartAccount(account1OwnersPublicKeys, 2);

        bytes memory data = abi.encodeWithSelector(
            account1.changeThreshold.selector,
            1
        );

        // Step 3: Compute tx hash
        bytes32 txHash = account1.getTransactionHash(
            address(account1), // to
            0, // value
            data, // data
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            address(0),
            account1.nonce() // current Safe nonce
        );

        // Step 4: Collect signatures from owners (example: 2 owners with known private keys)

        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(
            account1OwnersPrivateKeys[0],
            txHash
        );
        (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(
            account1OwnersPrivateKeys[1],
            txHash
        );

        // Construct signatures with correct ordering , its necessary otherwise transaction fails
        bytes memory sig1 = abi.encodePacked(r1, s1, v1);
        bytes memory sig2 = abi.encodePacked(r2, s2, v2);

        bytes memory signatures;
        if (account1OwnersPublicKeys[0] < account1OwnersPublicKeys[1]) {
            signatures = bytes.concat(sig1, sig2);
        } else {
            signatures = bytes.concat(sig2, sig1);
        }

        // bytes memory signatures = abi.encodePacked(r1, s1, v1, r2, s2, v2);

        // Step 5: Execute the transaction
        bool success = account1.execTransaction(
            address(account1),
            0,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );

        assertEq(account1.getThreshold(), 1);
    }

    function test_transferETH() public {
        Safe account1 = createSmartAccount(account1OwnersPublicKeys, 2);

        vm.deal(address(account1), 10 ether);

        address recepient = makeAddr("recepient");
        bytes memory data = ""; // empty for plan ETH

        bytes32 txHash = account1.getTransactionHash(
            recepient,
            1 ether,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            address(0),
            account1.nonce()
        );

        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(
            account1OwnersPrivateKeys[0],
            txHash
        );
        (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(
            account2OwnersPrivateKeys[1],
            txHash
        );

        bytes memory sig1 = abi.encodePacked(r1, s1, v1);
        bytes memory sig2 = abi.encodePacked(r2, s2, v2);

        bytes memory signatures;
        if (account1OwnersPublicKeys[0] < account1OwnersPublicKeys[1]) {
            signatures = bytes.concat(sig1, sig2);
        } else {
            signatures = bytes.concat(sig2, sig1);
        }

        account1.execTransaction(
            recepient,
            1 ether,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );

        assertEq(address(recepient).balance, 1 ether);
        assertEq(address(account1).balance, 9 ether);
    }

    function test_transferTokens() public {
        Safe account1 = createSmartAccount(account1OwnersPublicKeys, 2);

        safeToken.mint(address(account1), 1000 ether); // mint token to safe
        safeToken.approve(address(account1), type(uint256).max);

        address recepient = makeAddr("recepient");
        bytes memory data = abi.encodeWithSelector(
            safeToken.transfer.selector,
            recepient,
            10 ether
        ); // send 10 tokens to recepient

        bytes32 txHash = account1.getTransactionHash(
            address(safeToken), // call ERC20 contract
            0, // 0 ether
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            address(0),
            account1.nonce()
        );

        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(
            account1OwnersPrivateKeys[0],
            txHash
        );
        (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(
            account2OwnersPrivateKeys[1],
            txHash
        );

        bytes memory sig1 = abi.encodePacked(r1, s1, v1);
        bytes memory sig2 = abi.encodePacked(r2, s2, v2);

        bytes memory signatures;
        if (account1OwnersPublicKeys[0] < account1OwnersPublicKeys[1]) {
            signatures = bytes.concat(sig1, sig2);
        } else {
            signatures = bytes.concat(sig2, sig1);
        }

        account1.execTransaction(
            address(safeToken),
            0,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );

        assertEq(safeToken.balanceOf(recepient), 10 ether);
        assertEq(safeToken.balanceOf(address(account1)), 990 ether);
    }

    function test_setGuard() public {
        Safe account1 = createSmartAccount(account1OwnersPublicKeys, 2);
        SimpleGuard simpleGuard = new SimpleGuard();
        setGuard(account1, address(simpleGuard));
    }

    function test_transferEthWithGuardEnabled() public {
        Safe account1 = createSmartAccount(account1OwnersPublicKeys, 2);
        SimpleGuard simpleGuard = new SimpleGuard();
        setGuard(account1, address(simpleGuard));

        vm.deal(address(account1), 20 ether);

        address recepient = makeAddr("recepient");
        bytes memory data = ""; // empty for plan ETH

        bytes32 txHash = account1.getTransactionHash(
            recepient,
            11 ether,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            address(0),
            account1.nonce()
        );

        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(
            account1OwnersPrivateKeys[0],
            txHash
        );
        (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(
            account2OwnersPrivateKeys[1],
            txHash
        );

        bytes memory sig1 = abi.encodePacked(r1, s1, v1);
        bytes memory sig2 = abi.encodePacked(r2, s2, v2);

        bytes memory signatures;
        if (account1OwnersPublicKeys[0] < account1OwnersPublicKeys[1]) {
            signatures = bytes.concat(sig1, sig2);
        } else {
            signatures = bytes.concat(sig2, sig1);
        }

        vm.expectRevert();

        account1.execTransaction(
            recepient,
            11 ether,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );
    }

    function setGuard(Safe account1, address _simpleGuard) internal {
        bytes memory data = abi.encodeWithSelector(
            account1.setGuard.selector,
            address(_simpleGuard)
        );

        // if values is greater than 10 ETH the guard will revert the transaction
        bytes32 txHash = account1.getTransactionHash(
            address(account1),
            0,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            address(0),
            account1.nonce()
        );

        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(
            account1OwnersPrivateKeys[0],
            txHash
        );
        (uint8 v2, bytes32 r2, bytes32 s2) = vm.sign(
            account2OwnersPrivateKeys[1],
            txHash
        );

        bytes memory sig1 = abi.encodePacked(r1, s1, v1);
        bytes memory sig2 = abi.encodePacked(r2, s2, v2);

        bytes memory signatures;
        if (account1OwnersPublicKeys[0] < account1OwnersPublicKeys[1]) {
            signatures = bytes.concat(sig1, sig2);
        } else {
            signatures = bytes.concat(sig2, sig1);
        }

        account1.execTransaction(
            address(account1),
            0,
            data,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );
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
