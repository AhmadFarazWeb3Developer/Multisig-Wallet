import { ethers } from "ethers";

import Interfaces from "@/blockchain-interaction/helper/interfaces";
import DeterministicAddresses from "@/blockchain-interaction/helper/deterministicAddresses";
import useSafeInstance from "../useSafeInstance";
import { toast } from "sonner";
import { parseUnits } from "ethers/lib/utils";

const useTransferSafeTokens = (safeAddress) => {
  const { safeTokensInterface } = Interfaces();
  const addresses = DeterministicAddresses();
  const { safeReadInstance } = useSafeInstance(safeAddress);

  const transferSafeTokens = async (metadata) => {
    try {
      if (!safeReadInstance) {
        toast.error("Safe is not ready", {
          action: {
            label: "Close",
          },
        });
        return;
      }

      // data
      const data = safeTokensInterface.encodeFunctionData("transfer", [
        metadata.token_recipient,
        parseUnits(metadata.token_amount, 18),
      ]);

      const safeTokensAddress = addresses.safeTokensMockAddress;
      const value = 0;
      const operation = 0;
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;
      const nonce = await safeReadInstance.nonce();

      const txHash = await safeReadInstance.getTransactionHash(
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
