// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import {GuardManager} from "./base/GuardManager.sol";
import {ITransactionGuard} from "./base/GuardManager.sol";
import {Enum} from "./libraries/Enum.sol";
import {IERC165} from "./interfaces/IERC165.sol";

contract SimpleGuard is ITransactionGuard, GuardManager {
    event ExecutionSuccess(bytes32 hash);
    error NoMoreThan10(uint256 value);

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external override {
        if (value > 10e18) {
            revert NoMoreThan10(value);
        }
    }

    function checkAfterExecution(bytes32 hash, bool success) external override {
        if (!success) revert("Success Failed");
        else {
            emit ExecutionSuccess(hash);
        }
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external view virtual override returns (bool) {
        return
            interfaceId == type(ITransactionGuard).interfaceId || // 0xe6d7a83a
            interfaceId == type(IERC165).interfaceId; // 0x01ffc9a7
    }
}
