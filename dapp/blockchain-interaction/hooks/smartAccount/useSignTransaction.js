import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";
import { hexZeroPad } from "ethers/lib/utils";
import { toast } from "sonner";

const useSignTransaction = () => {
  const InstancesSigner = useInstancesSigner();

  const submitSignature = async (tx_hash, owner_address, signature) => {
    const payload = {
      tx_hash: tx_hash,
      owner_address: owner_address,
      signature: signature,
    };

    const response = await fetch("/api/transactions/sign-transaction", {
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
    }

    toast.success("Transaction Signed!", {
      action: {
        label: "Close",
      },
    });
  };

  const signTransaction = async (tx_hash, sender_address) => {
    const { signer } = await InstancesSigner();
    if (!signer) {
      ("no signer");
    }
    const Bytes32Hash = hexZeroPad(tx_hash);

    const signature = await signer.signMessage(Bytes32Hash);

    await submitSignature(tx_hash, sender_address, signature);
  };

  return signTransaction;
};

export default useSignTransaction;
