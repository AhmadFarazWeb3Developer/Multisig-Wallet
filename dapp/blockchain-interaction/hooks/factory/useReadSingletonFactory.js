import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useConstants from "../../helper/useConstants";
import { getProviderByChainId } from "../../helper/getProviderByChainId";
// import useReadFactoryInstanceStore from "../../stores/useReadFactoryInstanceStore.store";

useReadFactoryContract = () => {
  const { singletonFactoryAddress, singletonFactoryABI } = useConstants();
  //   const { setFactoryReadInstance } = useReadFactoryInstanceStore();
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

      const balance = await provider.getBalance(singletonFactoryAddress);

      //   setFactoryReadInstance(contract);
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
