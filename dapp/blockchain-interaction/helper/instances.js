import { ethers } from "ethers";
import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import SafeProxyFactoryArtifact from "../../app/on-chain/artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json";
import CompatibilityFallbackHandlerArtifact from "../../app/on-chain/artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json";

import DeterministicAddresses from "./deterministicAddresses";
import { getProviderByChainId } from "./getProviderByChainId";

const Instances = () => {
  const provider = getProviderByChainId(31337);

  const {
    safeSingltonAddress,
    safeProxyFactoryAddress,
    fallbackHandlerAddress,
  } = DeterministicAddresses();

  const safeSingltonAbi = SafeArtifact.abi;
  const safeProxyFactoryAbi = SafeProxyFactoryArtifact.abi;
  const compatibilityFallbackHandlerAbi =
    CompatibilityFallbackHandlerArtifact.abi;

  const safeSingltonInstance = new ethers.Contract(
    safeSingltonAddress,
    safeSingltonAbi,
    provider
  );

  const safeProxyFactoryIntance = new ethers.Contract(
    safeProxyFactoryAddress,
    safeProxyFactoryAbi,
    provider
  );

  const compatibilityFallbackHandlerInstace = new ethers.Contract(
    fallbackHandlerAddress,
    compatibilityFallbackHandlerAbi,
    provider
  );

  return {
    safeSingltonInstance,
    safeProxyFactoryIntance,
    compatibilityFallbackHandlerInstace,
  };
};

export default Instances;
