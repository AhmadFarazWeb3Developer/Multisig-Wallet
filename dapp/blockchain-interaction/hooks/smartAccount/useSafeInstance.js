import { useMemo } from "react";
import { ethers } from "ethers";
import SafeAbi from "../../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import { getProviderByChainId } from "../../helper/getProviderByChainId";

export default function useSafeInstance(safeAddress) {
  const provider = getProviderByChainId(31337);

  // Recreate instance only when safeAddress changes
  const safeInstance = useMemo(() => {
    if (!safeAddress) return null;

    return new ethers.Contract(safeAddress, SafeAbi.abi, provider);
  }, [safeAddress, provider]);

  return safeInstance;
}
