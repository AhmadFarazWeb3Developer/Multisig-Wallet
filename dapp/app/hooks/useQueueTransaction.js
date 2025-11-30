import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const useQueueTransaction = () => {
  const { isConnected, address } = useAppKitAccount();
  const [IsLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queueTransaction = async (operation, formData) => {
    if (!isConnected || !address) {
      toast.error("Wallet is not connected");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/owners/get-owner?address=${encodeURIComponent(address)}`
      );

      if (!res.ok) {
        toast.error("Failed fetching owner");
        return;
      }

      const data = await res.json();

      const metadata = {
        ...(formData.eth_amount && { eth_amount: formData.eth_amount }),
        ...(formData.eth_recipient && {
          eth_recipient: formData.eth_recipient,
        }),
        ...(formData.token_amount && { token_amount: formData.token_amount }),
        ...(formData.token_recipient && {
          token_recipient: formData.token_recipient,
        }),
        ...(formData.newOwner_with_threshold && {
          newOwner_with_threshold: formData.newOwner_with_threshold,
        }),
        ...(formData.new_threshold1 && {
          new_threshold1: formData.new_threshold1,
        }),
        ...(formData.prevOwner_for_removal && {
          prevOwner_for_removal: formData.prevOwner_for_removal,
        }),
        ...(formData.newOwner_for_removal && {
          newOwner_for_removal: formData.newOwner_for_removal,
        }),
        ...(formData.newThreshold_for_removal && {
          newThreshold_for_removal: formData.newThreshold_for_removal,
        }),
        ...(formData.new_threshold2 && {
          new_threshold2: formData.new_threshold2,
        }),
        ...(formData.guardAddress && { guard_address: formData.guardAddress }),

        ...(formData.mint_token_amount && {
          mint_token_amount: formData.mint_token_amount,
        }),

        ...(formData.newOwner_for_swap && {
          newOwner_for_swap: formData.newOwner_for_swap,
        }),
      };

      const payload = {
        operation_name: operation,
        operation_description: formData.operation_description,
        sender_address: data.owner_address,
        sender_name: data.owner_name,
        metadata,
      };

      const response = await fetch("/api/transactions/queue-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Error queueing transaction", {
          action: { label: "Close" },
        });
        return;
      } else {
        toast.success("Transaction Queued!", {
          action: { label: "Close" },
        });

        router.push("/dashboard");
      }

      return result;
    } catch (err) {
      console.error("Queue error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { queueTransaction, IsLoading };
};

export default useQueueTransaction;
