import { ethers } from "ethers";

import Interfaces from "../../helper/interfaces";

import useSafeInstance from "./useSafeInstance";
import { toast } from "sonner";
import { isAddress } from "ethers/lib/utils";

const useSetGuard = (safeAddress) => {
  const iface = Interfaces();
  const safeInstance = useSafeInstance(safeAddress);

  const setGuard = async (formData) => {
    try {
      if (!safeInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (!isAddress(formData.guardAddress)) {
        toast.error("guard must be a valid address");
        return;
      }

      const interfaceOf = iface.safeSingltonInterface;

      // data
      const data = interfaceOf.encodeFunctionData("setGuard", [
        formData.guardAddress,
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

  return setGuard;
};

export default useSetGuard;
