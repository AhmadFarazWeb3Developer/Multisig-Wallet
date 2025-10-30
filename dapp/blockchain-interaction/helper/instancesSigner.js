import { ethers } from "ethers";
import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import SafeProxyFactoryArtifact from "../../app/on-chain/artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json";
import CompatibilityFallbackHandlerArtifact from "../../app/on-chain/artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json";

import DeterministicAddresses from "./deterministicAddresses";

import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";

const useInstancesSigner = () => {
  const { walletProvider } = useAppKitProvider("eip155");
  const { isConnected } = useAppKitAccount();
  const [error, setError] = useState("");

  const {
    safeSingltonAddress,
    safeProxyFactoryAddress,
    fallbackHandlerAddress,
  } = DeterministicAddresses();

  const InstancesSigner = async () => {
    try {
      if (!isConnected) {
        setError("Wallet not connected");
        return;
      }
      if (!walletProvider) {
        setError("Provider not available");
        return;
      }

      const provider = new ethers.providers.Web3Provider(walletProvider);
      console.log("provider : ", provider);

      const signer = provider.getSigner();
      console.log("signer : ", signer);

      const safeSingltonInstance = new ethers.Contract(
        safeSingltonAddress,
        SafeArtifact.abi,
        signer
      );

      const safeProxyFactoryIntance = new ethers.Contract(
        safeProxyFactoryAddress,
        SafeProxyFactoryArtifact.abi,
        signer
      );

      console.log(safeProxyFactoryIntance);

      const compatibilityFallbackHandlerInstace = new ethers.Contract(
        fallbackHandlerAddress,
        CompatibilityFallbackHandlerArtifact.abi,
        signer
      );

      console.log(compatibilityFallbackHandlerInstace);
      return {
        signer,
        safeSingltonInstance,
        safeProxyFactoryIntance,
        compatibilityFallbackHandlerInstace,
      };
    } catch (error) {}
  };

  return InstancesSigner;
};

export default useInstancesSigner;
