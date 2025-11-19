import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "sonner";

const useTransferETH_queueTransaction = () => {
  const { isConnected, address } = useAppKitAccount();

  const transferETH_queueTransaction = async (operation, formData, txHash) => {
    if (!isConnected || !address) {
      toast.error("wallet is not connected");
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

    const payload = {
      operation_name: operation,
      amount: formData.amount,
      amount_to: formData.recipient,
      operation_description: formData.description,
      sender_address: data.owner_address,
      sender_name: data.owner_name,
      tx_hash: txHash,
    };

    const response = await fetch("/api/transactions/queueTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const anotherData = await response.json();

    if (!response.ok) {
      toast.error(anotherData.error || "Error queueing transaction");
      return;
    }

    toast.success(`
      Transaction queued successfully wiht Transaction Hash: ${txHash}`);
  };

  return transferETH_queueTransaction;
};

export default useTransferETH_queueTransaction;
