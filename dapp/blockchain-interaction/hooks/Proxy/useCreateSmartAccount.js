import { ethers, providers } from "ethers";
import Interfaces from "../../helper/interfaces";
import DeterministicAddresses from "../../helper/deterministicAddresses";
import Instances from "../../helper/instances";
import { getProviderByChainId } from "../../helper/getProviderByChainId";
import SafeArtifact from "../../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";

const useCreateSmartAccount = () => {
  const { safeProxyFactoryInterface } = Interfaces();
  const { safeSingltonAddress, fallbackHandlerAddress } =
    DeterministicAddresses();

  const { safeProxyFactoryIntance } = Instances();

  const provider = getProviderByChainId(31337);

  const createSmartAccount = async (owners, threshold) => {
    const initializer = safeProxyFactoryInterface.encodeFunctionData("setup", [
      owners,
      threshold,
      ethers.constants.AddressZero,
      "0x",
      fallbackHandlerAddress,
      ethers.constants.AddressZero,
      0,
      ethers.constants.AddressZero,
    ]);

    const newUserproxy = await safeProxyFactoryIntance.createProxyWithNonce(
      safeSingltonAddress,
      initializer,
      10 //salt
    );

    const tx = await newUserproxy.wait();

    console.log("tx : ", tx);
    // Typecast the proxy address to Safe ABI
    const newUserSafeAccount = new ethers.Contract(
      proxyAddress,
      SafeArtifact.abi,
      provider
    );

    return newUserSafeAccount;
  };

  return createSmartAccount;
};

export default useCreateSmartAccount;
