import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "sonner";

const useQueueTransaction = () => {
  const { isConnected, address } = useAppKitAccount();

  const queueTransaction = async (operation, formData, txHash) => {
    if (!isConnected || !address) {
      toast.error("Wallet is not connected");
      return;
    }

    const res = await fetch(
      `/api/owners/get-owner?address=${encodeURIComponent(address)}`
    );

    if (!res.ok) {
      console.error("Server error:", res.status);
      return;
    }

    const data = await res.json();

    //  dynamic metadata
    const metadata = {
      // 1
      ...(formData.eth_amount && { eth_amount: formData.eth_amount }),
      ...(formData.eth_recipient && { eth_recipient: formData.eth_recipient }),

      // 2
      ...(formData.token_amount && { token_amount: formData.token_amount }),
      ...(formData.token_recipient && {
        token_recipient: formData.token_recipient,
      }),
      // 3
      ...(formData.newOwner_with_threshold && {
        newOwner_with_threshold: formData.newOwner_with_threshold,
      }),
      ...(formData.new_threshold1 && {
        new_threshold1: formData.new_threshold1,
      }),

      // 4
      ...(formData.prevOwner_for_removal && {
        prevOwner_for_removal: formData.prevOwner_for_removal,
      }),
      ...(formData.newOwner_for_removal && {
        newOwner_for_removal: formData.newOwner_for_removal,
      }),
      ...(formData.newThreshold_for_removal && {
        newThreshold_for_removal: formData.newThreshold_for_removal,
      }),
      // 5
      ...(formData.new_threshold2 && {
        new_threshold2: formData.new_threshold2,
      }),
      // 6
      ...(formData.guardAddress && { guard_address: formData.guardAddress }),

      // 7
      ...(formData.mint_token_amount && {
        mint_token_amount: formData.mint_token_amount,
      }),

      // 8
      ...(formData.prevOwner_for_swap && {
        prevOwner_for_swap: formData.prevOwner_for_swap,
      }),
      ...(formData.oldOwner_for_swap && {
        oldOwner_for_swap: formData.oldOwner_for_swap,
      }),
      ...(formData.newOwner_for_swap && {
        newOwner_for_swap: formData.newOwner_for_swap,
      }),
    };

    // Main payload
    const payload = {
      operation_name: operation,
      operation_description: formData.operation_description,
      sender_address: data.owner_address,
      sender_name: data.owner_name,
      tx_hash: txHash,
      metadata, // metadata
    };

    const response = await fetch("/api/transactions/queueTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error || "Error queueing transaction", {
        action: { label: "Close" },
      });
      return;
    }

    toast.success("Transaction Queued!", {
      action: {
        label: "Close",
      },
    });
  };

  return queueTransaction;
};

export default useQueueTransaction;
