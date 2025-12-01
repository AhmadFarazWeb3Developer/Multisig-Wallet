import { useMemo } from "react";
import { ethers } from "ethers";
import SafeAbi from "../../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import { getProviderByChainId } from "../../helper/getProviderByChainId";
import { useAppKitProvider } from "@reown/appkit/react";

export default function useSafeInstance(safeAddress) {
  const { walletProvider } = useAppKitProvider("eip155");

  const provider = useMemo(() => {
    return getProviderByChainId(31337);
  }, [safeAddress]);

  const safeReadInstance = useMemo(() => {
    if (!safeAddress || !provider) return null;

    return new ethers.Contract(safeAddress, SafeAbi.abi, provider);
  }, [safeAddress, provider]);

  const safeWriteInstace = useMemo(() => {
    if (!safeAddress || !walletProvider) return null;

    const web3Provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = web3Provider.getSigner();

    return new ethers.Contract(safeAddress, SafeAbi.abi, signer);
  }, [safeAddress, walletProvider]);

  return { safeReadInstance, safeWriteInstace };
}
