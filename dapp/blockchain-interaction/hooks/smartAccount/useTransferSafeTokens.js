import { ethers } from "ethers";

import Interfaces from "@/blockchain-interaction/helper/interfaces";
import DeterministicAddresses from "@/blockchain-interaction/helper/deterministicAddresses";
import useSafeInstance from "./useSafeInstance";
import { toast } from "sonner";

const useTransferSafeTokens = (safeAddress) => {
  const iface = Interfaces();
  const addresses = DeterministicAddresses();
  const safeInstance = useSafeInstance(safeAddress);

  const transferSafeTokens = async (formData) => {
    try {
      if (!safeInstance) {
        toast.error("Safe is not ready");
        return;
      }

      const interfaceOf = iface.safeTokensInterface;

      // data
      const data = interfaceOf.encodeFunctionData("transfer", [
        formData.recipient,
        formData.amount,
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

      toast.success(`Transaction hash generated successfully! ${txHash}`);
      return txHash;
    } catch (error) {
      console.error(error);
      toast.error(`Error sending tokens: ${error.message || error}`);
    }
  };

  return transferSafeTokens;
};

export default useTransferSafeTokens;
