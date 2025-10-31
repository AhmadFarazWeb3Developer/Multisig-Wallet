// import { ethers } from "ethers";

// import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";

// import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
// import SafeProxyFactoryArtifact from "../../app/on-chain/artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json";
// import CompatibilityFallbackHandlerArtifact from "../../app/on-chain/artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json";

// import { getProviderByChainId } from "./getProviderByChainId";
// import useInstancesSigner from "./instancesSigner";
// import { useEffect, useState } from "react";

// const DeterministicAddresses = () => {
//   const InstancesSigner = useInstancesSigner();
//   const provider = getProviderByChainId(31337);

//   const singletonFactoryAddress = deployment["SafeModule#SingletonFactory"];
//   const safeInitCode = SafeArtifact.bytecode;
//   const proxyFactoryInitCode = SafeProxyFactoryArtifact.bytecode;
//   const fallbackHandlerInitCode = CompatibilityFallbackHandlerArtifact.bytecode;

//   const safeSalt = ethers.utils.keccak256(
//     ethers.utils.solidityPack(["string"], ["my-safe-singleton"])
//   );

//   const proxyFactorySalt = ethers.utils.keccak256(
//     ethers.utils.solidityPack(["string"], ["my-safe-proxy-factory"])
//   );
//   const fallbackHandlerSalt = ethers.utils.keccak256(
//     ethers.utils.solidityPack(["string"], ["my-CompatibilityFallbackHandler"])
//   );

//   const safeSingltonAddress = ethers.utils.getCreate2Address(
//     singletonFactoryAddress,
//     safeSalt,
//     ethers.utils.keccak256(safeInitCode)
//   );

//   const safeProxyFactoryAddress = ethers.utils.getCreate2Address(
//     singletonFactoryAddress,
//     proxyFactorySalt,
//     ethers.utils.keccak256(proxyFactoryInitCode)
//   );

//   const fallbackHandlerAddress = ethers.utils.getCreate2Address(
//     singletonFactoryAddress,
//     fallbackHandlerSalt,
//     ethers.utils.keccak256(fallbackHandlerInitCode)
//   );

//   const [safeFactoryIntance, setSafeFactoryIntance] = useState(null);

//   useEffect(() => {
//     const init = async () => {
//       const instances = await InstancesSigner();

//       if (!instances) {
//         console.log("instances are not ready");
//         return;
//       }
//       setSafeFactoryIntance(instances.safeProxyFactoryIntance);
//     };

//     init();
//   }, []);

//   safeDeployment(safeFactoryIntance);

//   return {
//     safeSingltonAddress,
//     safeProxyFactoryAddress,
//     fallbackHandlerAddress,
//   };
// };

// export default DeterministicAddresses;

// const safeDeployment = async (factory) => {
//   factory.deploy(SafeArtifact.bytecode, safeSalt);

//   const safeSingletonAddress = ethers.utils.getCreate2Address(
//     singletonFactoryAddress,
//     safeSalt,
//     ethers.utils.keccak256(SafeArtifact.bytecode)
//   );

//   const code = await provider.getCode(safeSingletonAddress);
//   console.log(code);
// };

import { ethers } from "ethers";
import deployment from "../../app/on-chain/ignition/deployments/chain-31337/deployed_addresses.json";
import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import SafeProxyFactoryArtifact from "../../app/on-chain/artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json";
import CompatibilityFallbackHandlerArtifact from "../../app/on-chain/artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json";
import { getProviderByChainId } from "./getProviderByChainId";
import useInstancesSigner from "./instancesSigner";
import { useEffect, useState } from "react";

const DeterministicAddresses = () => {
  const InstancesSigner = useInstancesSigner();
  const provider = getProviderByChainId(31337);

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
