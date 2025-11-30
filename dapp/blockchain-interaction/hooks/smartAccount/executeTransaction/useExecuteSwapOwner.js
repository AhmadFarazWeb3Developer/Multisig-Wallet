import { toast } from "sonner";
import { ethers, utils } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";
import Interfaces from "@/blockchain-interaction/helper/interfaces";
import useSafeInstance from "../useSafeInstance";

const useExecuteSwapOwner = (safeAddress) => {
  const { safeSingltonInterface } = Interfaces();
  const { safeReadInstance } = useSafeInstance(safeAddress);

  const executeSwapOwner = async (
    safeWriteInstace,
    metadata,
    aggregatedSignature,
    tx
  ) => {
    try {
      const to = safeAddress;
      const value = 0;

      const owners = await safeReadInstance.getOwners();

      const index = owners
        .map((o) => o.toLowerCase())
        .indexOf(String(tx.sender_address).trim().toLowerCase());

      const SENTINEL = "0x0000000000000000000000000000000000000001";
      const prevOwner = index === 0 ? SENTINEL : owners[index - 1];

      const data = safeSingltonInterface.encodeFunctionData("swapOwner", [
        prevOwner,
        tx.sender_address,
        tx.metadata.newOwner_for_swap,
      ]);

      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;

      // Get current nonce
      const nonce = await safeWriteInstace.nonce();
      console.log("Current Safe nonce:", nonce.toString());

      const execTransaction = await safeWriteInstace.execTransaction(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        aggregatedSignature
      );

      const receipt = await execTransaction.wait();

      const payload = {
        tx_id: tx.tx_id,
        tx_hash: receipt.transactionHash,
        metadata,
        operation_name: tx.operation_name,
        status: receipt.status,
      };

      const callApi = async (url, method, payload) => {
        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        return response.json();
      };

      const [storeExecutedResponse, swapOwnerResponse] = await Promise.all([
        callApi(
          "/api/transactions/store-executed-transaction",
          "POST",
          payload
        ),
        callApi("/api/owners/swap-owner", "PUT", {
          old_owner_address: tx.sender_address,
          new_owner_address: tx.metadata.newOwner_for_swap,
        }),
      ]);

      if (
        receipt &&
        storeExecutedResponse.status === 200 &&
        swapOwnerResponse.status === 200
      ) {
        toast.success(
          `${tx.sender_address} Swaped with ${tx.metadata.newOwner_for_swap}`,
          {
            action: {
              label: "Close",
            },
          }
        );
      }

      return receipt;
    } catch (error) {
      let capturedErrorCode = "Unknown";

      const data =
        error?.error?.data?.data?.data ||
        error?.error?.data?.data ||
        error?.error?.data ||
        error?.data ||
        error?.reason;

      console.log("Error data:", data);

      if (data) {
        if (typeof data === "string" && data.startsWith("0x08c379a0")) {
          try {
            const reason = ethers.utils.defaultAbiCoder.decode(
              ["string"],
              "0x" + data.slice(10)
            );
            capturedErrorCode = reason[0];
          } catch (e) {
            console.log("Failed to decode error:", e);
          }
        } else if (typeof data === "string") {
          capturedErrorCode = data;
        }
      }

      console.error("Execution error:", error);
      console.error("Captured error code:", capturedErrorCode);

      const errorMessage =
        SAFE_ERRORS[capturedErrorCode] ||
        capturedErrorCode ||
        "Transaction execution failed";

      toast.error(`Execution failed: ${errorMessage}`, {
        action: {
          label: "Close",
        },
      });

      throw error;
    }
  };

  return executeSwapOwner;
};

export default useExecuteSwapOwner;
