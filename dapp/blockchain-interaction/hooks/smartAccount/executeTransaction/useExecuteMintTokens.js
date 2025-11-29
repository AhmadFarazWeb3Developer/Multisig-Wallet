import { toast } from "sonner";
import { ethers, utils } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";
import Interfaces from "@/blockchain-interaction/helper/interfaces";
import DeterministicAddresses from "@/blockchain-interaction/helper/deterministicAddresses";

const useExecuteMintTokens = () => {
  const { safeTokensInterface } = Interfaces();
  const { safeTokensMockAddress } = DeterministicAddresses();

  const executeMintTokens = async (
    safeWriteInstace,
    metadata,
    aggregatedSignature,
    safeAddress
  ) => {
    try {
      console.log("safe address : ", safeAddress);
      console.log("metadata : ", metadata);

      const to = safeTokensMockAddress;
      const value = 0;
      const data = safeTokensInterface.encodeFunctionData("mint", [
        safeAddress,
        ethers.utils.parseUnits(metadata.mint_token_amount, 18),
      ]);
      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;

      const nonce = await safeWriteInstace.nonce();
      console.log("Current Safe nonce:", nonce.toString());

      const txHash = await safeWriteInstace.getTransactionHash(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce
      );

      console.log("current hash : ", txHash);

      console.log("Aggregated signature:", utils.hexlify(aggregatedSignature));

      console.log(
        "Hash we signed:",
        "0x749f41f3b0b613f390d71e4bf47f68b665c0e9cbea67b6ed454aa7192ce97118"
      );
      console.log("Hash contract will verify:", txHash);
      console.log(
        "Match:",
        txHash ===
          "0x749f41f3b0b613f390d71e4bf47f68b665c0e9cbea67b6ed454aa7192ce97118"
      );

      const tx = await safeWriteInstace.execTransaction(
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

      const receipt = await tx.wait();

      console.log("receipt : ", receipt);

      const payload = {
        tx_hash: txHash,
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

      if (receipt && getData.ok) {
        toast.success(`${metadata.mint_token_amount} tokens minted!`, {
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

  return executeMintTokens;
};

export default useExecuteMintTokens;
