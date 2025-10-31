import { ethers } from "ethers";
import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";

import SingletonFactoryArtifact from "../../app/on-chain/artifacts/contracts/SingletonFactory.sol/SingletonFactory.json";
import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import { getProviderByChainId } from "./getProviderByChainId";

export const deploySafeSingleton = async (walletProvider) => {
  if (!walletProvider) {
    console.error("Wallet provider is required!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(walletProvider);
  const signer = provider.getSigner();

  const singletonFactoryAddress = deployment["SafeModule#SingletonFactory"];

  const safeSalt = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["my-safe-singleton"])
  );

  const safeInitCode = SafeArtifact.bytecode;

  const safeSingltonAddress = ethers.utils.getCreate2Address(
    singletonFactoryAddress,
    safeSalt,
    ethers.utils.keccak256(safeInitCode)
  );

  const code = await provider.getCode(safeSingltonAddress);
  if (code !== "0x") {
    console.log("Safe singleton already deployed at:", safeSingltonAddress);
    return safeSingltonAddress;
  }

  console.log("Deploying Safe singleton...");

  const singletonFactoryInstance = new ethers.Contract(
    singletonFactoryAddress,
    SingletonFactoryArtifact.abi,
    signer
  );

  const tx = await singletonFactoryInstance.deploy(safeInitCode, safeSalt);
  const receipt = await tx.wait();

  console.log("Safe deployed! Transaction hash:", receipt.transactionHash);
  console.log("Safe singleton address:", safeSingltonAddress);

  return safeSingltonAddress;
};
