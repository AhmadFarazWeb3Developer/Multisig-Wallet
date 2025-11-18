import { ethers } from "ethers";

import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";

const DeterministicAddresses = () => {
  const singletonFactoryAddress = deployment["SafeModule#SingletonFactory"];
  const safeSingltonAddress = deployment["SafeModule#SafeSingleton"];
  const safeProxyFactoryAddress = deployment["SafeModule#SafeProxyFactory"];
  const fallbackHandlerAddress = deployment["SafeModule#FallbackHandler"];
  const safeTokensMockAddress = deployment["SafeModule#SafeTokensMock"];

  return {
    safeSingltonAddress,
    safeProxyFactoryAddress,
    fallbackHandlerAddress,
    safeTokensMockAddress,
  };
};

export default DeterministicAddresses;
