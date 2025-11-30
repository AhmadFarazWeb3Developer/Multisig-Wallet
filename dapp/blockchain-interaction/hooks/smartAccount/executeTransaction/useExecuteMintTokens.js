import { toast } from "sonner";
import { ethers } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";
import Interfaces from "@/blockchain-interaction/helper/interfaces";
import DeterministicAddresses from "@/blockchain-interaction/helper/deterministicAddresses";
import { parseUnits } from "ethers/lib/utils";

const useExecuteMintTokens = (safeAddress) => {
  const { safeTokensInterface } = Interfaces();
  const { safeTokensMockAddress } = DeterministicAddresses();

  const executeMintTokens = async (
    safeWriteInstace,
    metadata,
    aggregatedSignature,

    tx
  ) => {
    try {
      const to = safeTokensMockAddress;
      const value = 0;

      const data = safeTokensInterface.encodeFunctionData("mint", [
        safeAddress,
        parseUnits(metadata.mint_token_amount, 18),
      ]);
      const operation = 0;
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

      const response = await fetch(
        "/api/transactions/store-executed-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const getData = await response.json();

      if (receipt && getData.status === 200) {
        toast.success(`${metadata.mint_token_amount} tokens minted!`, {
          action: { label: "Close" },
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

  return executeMintTokens;
};

export default useExecuteMintTokens;
