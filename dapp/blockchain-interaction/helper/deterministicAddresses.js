import { ethers } from "ethers";

import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";

import { getProviderByChainId } from "./getProviderByChainId";

import { use, useEffect, useState } from "react";

const DeterministicAddresses = () => {
  const provider = getProviderByChainId(31337);

  const singletonFactoryAddress = deployment["SafeModule#SingletonFactory"];
  const safeSingltonAddress = deployment["SafeModule#SafeSingleton"];
  const safeProxyFactoryAddress = deployment["SafeModule#SafeProxyFactory"];
  const fallbackHandlerAddress = deployment["SafeModule#FallbackHandler"];

  useEffect(() => {
    const init = async () => {
      const safeCode = await provider.getCode(safeSingltonAddress);
      const proxyFactoryCode = await provider.getCode(safeProxyFactoryAddress);
      const fallbackHandlerCode = await provider.getCode(
        fallbackHandlerAddress
      );

      console.log("safe code : ", safeCode);
    };

    init();
  });

  return {
    safeSingltonAddress,
    safeProxyFactoryAddress,
    fallbackHandlerAddress,
  };
};

export default DeterministicAddresses;
