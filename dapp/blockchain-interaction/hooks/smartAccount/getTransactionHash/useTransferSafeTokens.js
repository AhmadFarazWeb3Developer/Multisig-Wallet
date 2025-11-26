import { ethers } from "ethers";

import Interfaces from "@/blockchain-interaction/helper/interfaces";
import DeterministicAddresses from "@/blockchain-interaction/helper/deterministicAddresses";
import useSafeInstance from "../useSafeInstance";
import { toast } from "sonner";

const useTransferSafeTokens = (safeAddress) => {
  const iface = Interfaces();
  const addresses = DeterministicAddresses();
  const safeInstance = useSafeInstance(safeAddress);

  const transferSafeTokens = async (metadata) => {
    try {
      if (!safeInstance) {
        toast.error("Safe is not ready", {
          action: {
            label: "Close",
          },
        });
        return;
      }

      const interfaceOf = iface.safeTokensInterface;

      console.log("metadata", metadata);
      // data
      const data = interfaceOf.encodeFunctionData("transfer", [
        metadata.token_recipient,
        metadata.token_amount,
      ]);

      const safeTokensAddress = addresses.safeTokensMockAddress;
      const value = 0;
      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;
      const nonce = await safeInstance.nonce();

      // transaction hash
      const txHash = await safeInstance.getTransactionHash(
        safeTokensAddress,
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

      toast.success(`Transaction hash generated successfully! ${txHash}`, {
        action: {
          label: "Close",
        },
      });
      return txHash;
    } catch (error) {
      console.error(error);
      toast.error(`Error sending tokens: ${error.message || error}`, {
        action: {
          label: "Close",
        },
      });
    }
  };

  return transferSafeTokens;
};

export default useTransferSafeTokens;
