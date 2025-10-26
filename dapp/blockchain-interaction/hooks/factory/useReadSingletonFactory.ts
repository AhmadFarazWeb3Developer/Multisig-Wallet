import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useConstants from "../../helper/useConstants";
// import useReadFactoryInstanceStore from "../../stores/useReadFactoryInstanceStore.store";
import { hardhat_provider } from "@/blockchain-interaction/helper/provider";

const useReadFactoryContract = () => {
  const { singletonFactoryAddress, singletonFactoryABI } = useConstants();
  //   const { setFactoryReadInstance } = useReadFactoryInstanceStore();
  const [singletonFactoryReadInstance, setSingletonFactoryReadInstance] =
    useState({});

  useEffect(() => {
    const init = async () => {
      if (!singletonFactoryAddress || !singletonFactoryABI) return;

      const contract = new ethers.Contract(
        singletonFactoryAddress,
        singletonFactoryABI,
        hardhat_provider
      );

      const balance = await hardhat_provider.getBalance(
        singletonFactoryAddress
      );

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
