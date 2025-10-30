// proxy factory  -> address
// safe

import { ethers } from "ethers";

import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";

import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import SafeProxyFactoryArtifact from "../../app/on-chain/artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json";
import CompatibilityFallbackHandlerArtifact from "../../app/on-chain/artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json";

const DeterministicAddresses = () => {
  const singletonFactoryAddress = deployment["SafeModule#SingletonFactory"];

  const safeInitCode = SafeArtifact.bytecode;
  const proxyFactoryInitCode = SafeProxyFactoryArtifact.bytecode;
  const fallbackHandlerInitCode = CompatibilityFallbackHandlerArtifact.bytecode;

  const safeSalt = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["my-safe-singleton"])
  );
  const proxyFactorySalt = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["my-safe-proxy-factory"])
  );
  const fallbackHandlerSalt = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string"], ["my-CompatibilityFallbackHandler"])
  );

  const safeSingltonAddress = ethers.utils.getCreate2Address(
    singletonFactoryAddress,
    safeSalt,
    ethers.utils.keccak256(safeInitCode)
  );

  const safeProxyFactoryAddress = ethers.utils.getCreate2Address(
    singletonFactoryAddress,
    proxyFactorySalt,
    ethers.utils.keccak256(proxyFactoryInitCode)
  );

  const fallbackHandlerAddress = ethers.utils.getCreate2Address(
    singletonFactoryAddress,
    fallbackHandlerSalt,
    ethers.utils.keccak256(fallbackHandlerInitCode)
  );

  return {
    safeSingltonAddress,
    safeProxyFactoryAddress,
    fallbackHandlerAddress,
  };
};

export default DeterministicAddresses;
