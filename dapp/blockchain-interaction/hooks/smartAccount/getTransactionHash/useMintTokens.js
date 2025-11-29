import { ethers } from "ethers";

import Interfaces from "../../../helper/interfaces";
import useSafeInstance from "../useSafeInstance";
import { toast } from "sonner";
import DeterministicAddresses from "@/blockchain-interaction/helper/deterministicAddresses";

const useMintTokens = (safeAddress) => {
  const { safeTokensInterface } = Interfaces();
  const { safeReadInstance } = useSafeInstance(safeAddress);
  const { safeTokensMockAddress } = DeterministicAddresses();

  const mintTokens = async (formData) => {
    try {
      if (!safeReadInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (!formData.mint_token_amount) {
        toast.error("Fill the form before proceeding");
        return;
      }

      // data
      const data = safeTokensInterface.encodeFunctionData("mint", [
        safeAddress,
        ethers.utils.parseUnits(formData.mint_token_amount, 18),
      ]);

      const to = safeTokensMockAddress;
      const value = 0;
      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;
      const nonce = await safeReadInstance.nonce();

      const txHash = await safeReadInstance.getTransactionHash(
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

  return mintTokens;
};

export default useMintTokens;
