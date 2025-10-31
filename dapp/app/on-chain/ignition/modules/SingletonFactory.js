const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { keccak256, solidityPacked } = require("ethers");

const SafeArtifact = require("../../artifacts/contracts/Safe.sol/Safe.json");
const SafeProxyFactoryArtifact = require("../../artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json");
const CompatibilityFallbackHandlerArtifact = require("../../artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json");

module.exports = buildModule("SafeModule", (m) => {
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
