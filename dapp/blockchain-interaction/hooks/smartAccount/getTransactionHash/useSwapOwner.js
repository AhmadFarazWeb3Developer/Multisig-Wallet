import { ethers } from "ethers";

import Interfaces from "../../../helper/interfaces";

import useSafeInstance from "../useSafeInstance";
import { toast } from "sonner";
import { isAddress } from "ethers/lib/utils";

const useSwapOwner = (safeAddress) => {
  const { safeSingltonInterface } = Interfaces();
  const { safeReadInstance } = useSafeInstance(safeAddress);

  const swapOwner = async (tx) => {
    try {
      if (!safeReadInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (!tx.metadata.newOwner_for_swap) {
        toast.error("Fill the form before proceeding");
        return;
      }

      if (!isAddress(tx.metadata.newOwner_for_swap)) {
        toast.error("owners must be a valid addresses");
        return;
      }

      const owners = await safeReadInstance.getOwners();

      console.log(owners);

      console.log(tx.sender_address);

      const index = owners
        .map((o) => o.toLowerCase())
        .indexOf(String(tx.sender_address).trim().toLowerCase());

      const SENTINEL = "0x0000000000000000000000000000000000000001";

      console.log(index);

      const prevOwner = index === 0 ? SENTINEL : owners[index - 1];

      console.log(prevOwner);

      const data = safeSingltonInterface.encodeFunctionData("swapOwner", [
        prevOwner,
        tx.sender_address,
        tx.metadata.newOwner_for_swap,
      ]);

      const to = safeAddress;
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

  return swapOwner;
};

export default useSwapOwner;
