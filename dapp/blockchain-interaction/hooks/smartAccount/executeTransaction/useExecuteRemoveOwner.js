import { toast } from "sonner";
import { ethers, utils } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";
import Interfaces from "@/blockchain-interaction/helper/interfaces";

const useExecuteRemoveOwner = (safeAddress) => {
  const { safeSingltonInterface } = Interfaces();

  const executeRemoveOwner = async (
    safeWriteInstace,
    metadata,
    aggregatedSignature,
    tx
  ) => {
    try {
      if (!safeWriteInstace) {
        toast.error("Safe is not ready");
        return;
      }
      const to = safeAddress;
      const value = 0;

      const owners = await safeWriteInstace.getOwners();

      const index = owners
        .map((o) => o.toLowerCase())
        .indexOf(String(metadata.owner_for_removal).trim().toLowerCase());

      const SENTINEL = "0x0000000000000000000000000000000000000001";
      const prevOwner = index === 0 ? SENTINEL : owners[index - 1];

      const data = safeSingltonInterface.encodeFunctionData("removeOwner", [
        prevOwner,
        metadata.owner_for_removal,
        metadata.newThreshold_for_removal,
      ]);
      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;

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

      const callApi = async (url, payload) => {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        return response.json();
      };

      const [storeExecutedResponse, removeOwnerResponse] = await Promise.all([
        callApi("/api/transactions/store-executed-transaction", payload),
        callApi("/api/owners/remove-owner", {
          remove_owner: metadata.owner_for_removal,
          safe: safeAddress,
        }),
      ]);

      if (
        receipt &&
        storeExecutedResponse.status === 200 &&
        removeOwnerResponse.status === 200
      ) {
        toast.success(`${metadata.owner_for_removal} removed!`, {
          action: {
            label: "Close",
          },
        });
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

  return executeRemoveOwner;
};

export default useExecuteRemoveOwner;
