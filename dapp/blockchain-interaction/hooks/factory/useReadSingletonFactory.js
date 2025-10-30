import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useConstants from "../../helper/useConstants";
import { getProviderByChainId } from "../../helper/getProviderByChainId";

useReadFactoryContract = () => {
  const { singletonFactoryAddress, singletonFactoryABI } = useConstants();
  const [singletonFactoryReadInstance, setSingletonFactoryReadInstance] =
    useState({});

  const provider = getProviderByChainId(31337);

  useEffect(() => {
    const init = async () => {
      if (!singletonFactoryAddress || !singletonFactoryABI) return;

      const contract = new ethers.Contract(
        singletonFactoryAddress,
        singletonFactoryABI,
        provider
      );

      setSingletonFactoryReadInstance(contract);
    };

    init();
  }, [
    singletonFactoryAddress,
    singletonFactoryABI,
    singletonFactoryReadInstance,
  ]);

  return;
};

export default useReadFactoryContract;
