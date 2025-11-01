import { ethers } from "ethers";

import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";

const DeterministicAddresses = () => {
  const singletonFactoryAddress = deployment["SafeModule#SingletonFactory"];
  const safeSingltonAddress = deployment["SafeModule#SafeSingleton"];
  const safeProxyFactoryAddress = deployment["SafeModule#SafeProxyFactory"];
  const fallbackHandlerAddress = deployment["SafeModule#FallbackHandler"];

  return {
    safeSingltonAddress,
    safeProxyFactoryAddress,
    fallbackHandlerAddress,
  };
};

export default DeterministicAddresses;
