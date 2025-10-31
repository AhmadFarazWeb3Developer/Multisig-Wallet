import { ethers } from "ethers";
import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import SafeProxyFactoryArtifact from "../../app/on-chain/artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json";
import CompatibilityFallbackHandlerArtifact from "../../app/on-chain/artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json";

import DeterministicAddresses from "./deterministicAddresses";
import { getProviderByChainId } from "./getProviderByChainId";

const InstancesProvider = () => {
  const provider = getProviderByChainId(31337);

  console.log("provider : ", provider);

  const {
    safeSingltonAddress,
    safeProxyFactoryAddress,
    fallbackHandlerAddress,
  } = DeterministicAddresses();

  const safeSingltonInstance = new ethers.Contract(
    safeSingltonAddress,
    SafeArtifact.abi,
    provider
  );

  const safeProxyFactoryIntance = new ethers.Contract(
    safeProxyFactoryAddress,
    SafeProxyFactoryArtifact.abi,
    provider
  );

  const compatibilityFallbackHandlerInstace = new ethers.Contract(
    fallbackHandlerAddress,
    CompatibilityFallbackHandlerArtifact.abi,
    provider
  );

  return {
    safeSingltonInstance,
    safeProxyFactoryIntance,
    compatibilityFallbackHandlerInstace,
  };
};

export default InstancesProvider;
