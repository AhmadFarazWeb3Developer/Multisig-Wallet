import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";
import { ethers } from "ethers";
import { arrayify, joinSignature, splitSignature } from "ethers/lib/utils";
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
      toast.error("No signer available");
      return;
    }

    const Bytes32Hash = arrayify(tx_hash);

    const rawSig = await signer.signMessage(Bytes32Hash);

    const sigObj = splitSignature(rawSig);
    console.log(
      "Split signature - r:",
      sigObj.r,
      "s:",
      sigObj.s,
      "v:",
      sigObj.v
    );

    // Adjust v value for Safe's eth_sign format
    let vSafe = sigObj.v;
    if (vSafe < 27) vSafe += 27;
    vSafe += 4; // Makes it 31 or 32

    const r = sigObj.r;
    const s = sigObj.s;
    const vHex = ethers.utils.hexZeroPad(ethers.utils.hexlify(vSafe), 1);

    const safeSig = r + s.slice(2) + vHex.slice(2);

    await submitSignature(tx_hash, sender_address, safeSig);
  };
  return signTransaction;
};

export default useSignTransaction;
