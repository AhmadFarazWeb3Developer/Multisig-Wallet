import { toast } from "sonner";
import { ethers } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";
import Interfaces from "@/blockchain-interaction/helper/interfaces";

const useExecuteAddOwnerWithThreshold = (safeAddress) => {
  const { safeSingltonInterface } = Interfaces();

  const executeAddOwnerWithThreshold = async (
    safeWriteInstance,
    metadata,
    aggregatedSignature,
    tx
  ) => {
    try {
      const to = safeAddress;
      const value = 0;
      const data = safeSingltonInterface.encodeFunctionData(
        "addOwnerWithThreshold",
        [metadata.newOwner_with_threshold, metadata.new_threshold1]
      );

      const operation = 0;
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;

      const execTransaction = await safeWriteInstance.execTransaction(
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
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return res.json();
      };

      const [storeTxRes, addOwnerRes] = await Promise.all([
        callApi("/api/transactions/store-executed-transaction", payload),
        callApi("/api/owners/add-owner", {
          safe: safeAddress,
          owner_address: metadata.newOwner_with_threshold,
        }),
      ]);

      if (receipt && storeTxRes.status === 200 && addOwnerRes.status === 200) {
        toast.success(
          `${metadata.newOwner_with_threshold} added as owner with new threshold ${metadata.new_threshold1}`,
          { action: { label: "Close" } }
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

      console.error("Execution error data:", data);

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

      const errorMessage =
        SAFE_ERRORS[capturedErrorCode] ||
        capturedErrorCode ||
        "Transaction execution failed";

      toast.error(`Execution failed: ${errorMessage}`, {
        action: { label: "Close" },
      });

      throw error;
    }
  };

  return executeAddOwnerWithThreshold;
};

export default useExecuteAddOwnerWithThreshold;
