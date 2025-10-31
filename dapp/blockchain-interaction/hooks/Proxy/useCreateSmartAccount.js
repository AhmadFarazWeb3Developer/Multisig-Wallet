import { ethers, providers } from "ethers";
import Interfaces from "../../helper/interfaces";
import DeterministicAddresses from "../../helper/deterministicAddresses";
import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";
import SafeArtifact from "../../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import { useEffect, useState } from "react";

const useCreateSmartAccount = () => {
  const { safeSingltonInterface, safeProxyFactoryInterface } = Interfaces();

  const instancesSigner = useInstancesSigner();

  const { safeSingltonAddress, fallbackHandlerAddress } =
    DeterministicAddresses();

  const [signer, setSigner] = useState(null);
  const [safeProxyFactoryIntance, setSafeProxyFactoryIntance] = useState(null);

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
    };

    init();
  }, []);

  const createSmartAccount = async (owners, threshold) => {
    if (!signer) {
      console.log("signer not avaliable");
    }
    if (!safeProxyFactoryIntance) {
      console.log("safeProxyFactoryIntance not avaliable");
    }

    console.log(owners);
    console.log(threshold);
    console.log("fall back : ", fallbackHandlerAddress);
    console.log("safe singleton : ", safeSingltonAddress);

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

    console.log("proxy factory : ", safeProxyFactoryIntance);

    console.log("safe singleton ", safeSingltonAddress);

    const tx = await safeProxyFactoryIntance.createProxyWithNonce(
      safeSingltonAddress,
      initializer,
      10 // salt
    );

    const receipt = await tx.wait();

    console.log("receipt  : ", receipt);

    const newUserSafeAccount = new ethers.Contract(
      proxyAddress,
      SafeArtifact.abi,
      signer
    );

    console.log("new safe ", newUserSafeAccount);

    return newUserSafeAccount;
  };

  return createSmartAccount;
};

export default useCreateSmartAccount;
