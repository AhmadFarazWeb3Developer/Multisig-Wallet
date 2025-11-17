import { ethers, providers } from "ethers";
import Interfaces from "../../helper/interfaces";
import DeterministicAddresses from "../../helper/deterministicAddresses";
import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";
import SafeArtifact from "../../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import { useEffect, useState } from "react";

const useCreateSmartAccount = () => {
  const instancesSigner = useInstancesSigner();
  const { safeSingltonInterface } = Interfaces();

  const { safeSingltonAddress, fallbackHandlerAddress } =
    DeterministicAddresses();

  const [signer, setSigner] = useState(null);
  const [safeProxyFactoryIntance, setSafeProxyFactoryIntance] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const instances = await instancesSigner();
      console.log("instances : ", instances);

      if (!instances) {
        console.log("instances are not ready");
        return;
      }
      setSigner(instances.signer);
      setSafeProxyFactoryIntance(instances.safeProxyFactoryIntance);
      setIsReady(true);
    };

    init();
  }, []);

  const createSmartAccount = async (owners, threshold) => {
    if (!isReady || !signer || !safeProxyFactoryIntance) {
      throw new Error(
        "Smart account instances not ready. Please wait and try again."
      );
    }

    const initializer = safeSingltonInterface.encodeFunctionData("setup", [
      owners,
      threshold,
      ethers.constants.AddressZero,
      "0x",
      fallbackHandlerAddress,
      ethers.constants.AddressZero,
      0,
      ethers.constants.AddressZero,
    ]);

    const saltNonce = Date.now() + Math.floor(Math.random() * 1000000);
    const tx = await safeProxyFactoryIntance.createProxyWithNonce(
      safeSingltonAddress,
      initializer,
      saltNonce
    );

    const receipt = await tx.wait();
    console.log("receipt  : ", receipt);
    console.log("events  : ", receipt.events);

    const proxyCreatedEvent = receipt.events?.find(
      (e) => e.event === "ProxyCreation"
    );

    console.log("events logs : ", proxyCreatedEvent?.args);
    const proxyAddress = proxyCreatedEvent?.args?.proxy;
    const singleton = proxyCreatedEvent?.args?.singleton;

    if (!proxyAddress) {
      throw new Error("Failed to get proxy address from transaction receipt");
    }

    const newUserSafeAccount = new ethers.Contract(
      proxyAddress,
      SafeArtifact.abi,
      signer
    );

    return newUserSafeAccount;
  };

  return { createSmartAccount, isReady };
};

export default useCreateSmartAccount;
