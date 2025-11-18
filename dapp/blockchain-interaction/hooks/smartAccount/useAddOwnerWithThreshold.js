import { ethers } from "ethers";

import Interfaces from "../../helper/interfaces";

import useSafeInstance from "./useSafeInstance";
import { toast } from "sonner";
import { isAddress } from "ethers/lib/utils";

const useAddOwnerWithThreshold = (safeAddress) => {
  const iface = Interfaces();
  const safeInstance = useSafeInstance(safeAddress);

  const addOwnerWithThreshold = async (formData) => {
    try {
      if (!safeInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (!isAddress(formData.newOwner)) {
        toast.error("owner must be a valid address");
        return;
      }

      const interfaceOf = iface.safeSingltonInterface;

      // data
      const data = interfaceOf.encodeFunctionData("addOwnerWithThreshold", [
        formData.newOwner,
        formData.newThreshold,
      ]);

      const to = safeAddress;
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

      toast.success(`Transaction hash generated successfully! ${txHash}`);
      return txHash;
    } catch (error) {
      console.error(error);
      toast.error(`Error sending tokens: ${error.message || error}`);
    }
  };

  return addOwnerWithThreshold;
};

export default useAddOwnerWithThreshold;
