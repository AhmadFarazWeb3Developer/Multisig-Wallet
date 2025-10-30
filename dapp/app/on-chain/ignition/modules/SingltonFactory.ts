import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256, solidityPacked } from "ethers";

import SafeArtifact from "../../artifacts/contracts/Safe.sol/Safe.json" assert { type: "json" };
import SafeProxyFactoryArtifact from "../../artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json" assert { type: "json" };
import CompatibilityFallbackHandlerArtifact from "../../artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json" assert { type: "json" };

export default buildModule("SafeModule", (m) => {
  // singtonFactory
  const singletonFactory = m.contract("SingletonFactory");

  const safeInitCode = SafeArtifact.bytecode;
  const proxyFactoryInitCode = SafeProxyFactoryArtifact.bytecode;
  const handlerInitCode = CompatibilityFallbackHandlerArtifact.bytecode;

  const safeSalt = keccak256(solidityPacked(["string"], ["my-safe-singleton"]));
  const proxyFactorySalt = keccak256(
    solidityPacked(["string"], ["my-safe-proxy-factory"])
  );
  const handlerSalt = keccak256(
    solidityPacked(["string"], ["my-CompatibilityFallbackHandler"])
  );

  m.call(singletonFactory, "deploy", [safeInitCode, safeSalt], {
    id: "DeploySafe",
  });
  m.call(singletonFactory, "deploy", [proxyFactoryInitCode, proxyFactorySalt], {
    id: "DeployProxyFactory",
  });
  m.call(singletonFactory, "deploy", [handlerInitCode, handlerSalt], {
    id: "DeployFallbackHandler",
  });

  return {
    singletonFactory,
  };
});
