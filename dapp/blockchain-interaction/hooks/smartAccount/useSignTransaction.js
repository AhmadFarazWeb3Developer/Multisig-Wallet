import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";
import { hexZeroPad } from "ethers/lib/utils";

const useSignTransaction = () => {
  const InstancesSigner = useInstancesSigner();

  const submitSignature = async () => {
    const response = await fetch("/api/");
  };

  const signTransaction = async (txHash) => {
    const { signer } = await InstancesSigner();
    if (!signer) {
      ("no signer");
    }
    const Bytes32Hash = hexZeroPad(txHash);

    console.log("singer ", await signer);
    const signature = await signer.signMessage(Bytes32Hash);
    console.log(signature);
  };

  return signTransaction;
};

export default useSignTransaction;
