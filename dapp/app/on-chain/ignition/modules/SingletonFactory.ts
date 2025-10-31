// // // import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// // // import { keccak256, solidityPacked } from "ethers";

// // // import SafeSingletonFactoryArtifact from "../../artifacts/contracts/SingletonFactory.sol/SingletonFactory.json" assert { type: "json" };
// // // import SafeArtifact from "../../artifacts/contracts/Safe.sol/Safe.json" assert { type: "json" };
// // // import SafeProxyFactoryArtifact from "../../artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json" assert { type: "json" };
// // // import CompatibilityFallbackHandlerArtifact from "../../artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json" assert { type: "json" };

// // // export default buildModule("SafeModule", (m) => {
// // //   // singtonFactory
// // //   const singletonFactory = m.contract("SingletonFactory");

// // //   const safeInitCode = SafeArtifact.bytecode;
// // //   const proxyFactoryInitCode = SafeProxyFactoryArtifact.bytecode;
// // //   const handlerInitCode = CompatibilityFallbackHandlerArtifact.bytecode;

// // //   const safeSalt = keccak256(solidityPacked(["string"], ["my-safe-singleton"]));
// // //   const proxyFactorySalt = keccak256(
// // //     solidityPacked(["string"], ["my-safe-proxy-factory"])
// // //   );
// // //   const handlerSalt = keccak256(
// // //     solidityPacked(["string"], ["my-CompatibilityFallbackHandler"])
// // //   );

// // //   m.call(singletonFactory, "deploy", [safeInitCode, safeSalt], {
// // //     id: "DeploySafe",
// // //   });

// // //   m.call(singletonFactory, "deploy", [proxyFactoryInitCode, proxyFactorySalt], {
// // //     id: "DeployProxyFactory",
// // //   });

// // //   m.call(singletonFactory, "deploy", [handlerInitCode, handlerSalt], {
// // //     id: "DeployFallbackHandler",
// // //   });

// // //   const safe = m.contractAt(
// // //     "Safe",
// // //     m.call(singletonFactory, "deploy", [safeInitCode, safeSalt])
// // //   );

// // //   const proxyFactory = m.contractAt(
// // //     "SafeProxyFactory",
// // //     m.call(singletonFactory, "deploy", [proxyFactoryInitCode, proxyFactorySalt])
// // //   );

// // //   const handler = m.contractAt(
// // //     "CompatibilityFallbackHandler",
// // //     m.call(singletonFactory, "deploy", [handlerInitCode, handlerSalt])
// // //   );

// // //   return {
// // //     singletonFactory,
// // //   };
// // // });

// // import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// // import { keccak256, solidityPacked } from "ethers";

// // import SafeSingletonFactoryArtifact from "../../artifacts/contracts/SingletonFactory.sol/SingletonFactory.json" assert { type: "json" };
// // import SafeArtifact from "../../artifacts/contracts/Safe.sol/Safe.json" assert { type: "json" };
// // import SafeProxyFactoryArtifact from "../../artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json" assert { type: "json" };
// // import CompatibilityFallbackHandlerArtifact from "../../artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json" assert { type: "json" };

// // export default buildModule("SafeModule", (m) => {
// //   // Deploy the SingletonFactory
// //   const singletonFactory = m.contract("SingletonFactory");

// //   // Bytecode
// //   const safeInitCode = SafeArtifact.bytecode;
// //   const proxyFactoryInitCode = SafeProxyFactoryArtifact.bytecode;
// //   const handlerInitCode = CompatibilityFallbackHandlerArtifact.bytecode;

// //   // CREATE2 salts
// //   const safeSalt = keccak256(solidityPacked(["string"], ["my-safe-singleton"]));
// //   const proxyFactorySalt = keccak256(
// //     solidityPacked(["string"], ["my-safe-proxy-factory"])
// //   );
// //   const handlerSalt = keccak256(
// //     solidityPacked(["string"], ["my-CompatibilityFallbackHandler"])
// //   );

// //   // Deterministically deploy and track each contract
// //   const safe = m.contractAt(
// //     "Safe",
// //     m.call(singletonFactory, "deploy", [safeInitCode, safeSalt])
// //   );

// //   const proxyFactory = m.contractAt(
// //     "SafeProxyFactory",
// //     m.call(singletonFactory, "deploy", [proxyFactoryInitCode, proxyFactorySalt])
// //   );

// //   const handler = m.contractAt(
// //     "CompatibilityFallbackHandler",
// //     m.call(singletonFactory, "deploy", [handlerInitCode, handlerSalt])
// //   );

// //   return {
// //     singletonFactory,
// //     safe,
// //     proxyFactory,
// //     handler,
// //   };
// // });

// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// import { keccak256, solidityPacked } from "ethers";

// import SafeSingletonFactoryArtifact from "../../artifacts/contracts/SingletonFactory.sol/SingletonFactory.json" assert { type: "json" };
// import SafeArtifact from "../../artifacts/contracts/Safe.sol/Safe.json" assert { type: "json" };
// import SafeProxyFactoryArtifact from "../../artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json" assert { type: "json" };
// import CompatibilityFallbackHandlerArtifact from "../../artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json" assert { type: "json" };

// export default buildModule("SafeModule", (m) => {
//   // 1️⃣ Deploy the singleton factory
//   const singletonFactory = m.contract("SingletonFactory");

//   // 2️⃣ Prepare bytecodes
//   const safeInitCode = SafeArtifact.bytecode;
//   const proxyFactoryInitCode = SafeProxyFactoryArtifact.bytecode;
//   const handlerInitCode = CompatibilityFallbackHandlerArtifact.bytecode;

//   // 3️⃣ Prepare salts
//   const safeSalt = keccak256(solidityPacked(["string"], ["my-safe-singleton"]));
//   const proxyFactorySalt = keccak256(
//     solidityPacked(["string"], ["my-safe-proxy-factory"])
//   );
//   const handlerSalt = keccak256(
//     solidityPacked(["string"], ["my-CompatibilityFallbackHandler"])
//   );

//   // Static call (does not actually send tx, just computes the deterministic address)
//   const safeAddress = m.staticCall(singletonFactory, "getAddress", [
//     safeInitCode,
//     safeSalt,
//   ]);
//   const proxyFactoryAddress = m.staticCall(singletonFactory, "getAddress", [
//     proxyFactoryInitCode,
//     proxyFactorySalt,
//   ]);
//   const handlerAddress = m.staticCall(singletonFactory, "getAddress", [
//     handlerInitCode,
//     handlerSalt,
//   ]);

//   // Deploy via m.call
//   // m.call(singletonFactory, "deploy", [safeInitCode, safeSalt], {
//   //   id: "DeploySafe",
//   // });
//   // m.call(singletonFactory, "deploy", [proxyFactoryInitCode, proxyFactorySalt], {
//   //   id: "DeployProxyFactory",
//   // });
//   // m.call(singletonFactory, "deploy", [handlerInitCode, handlerSalt], {
//   //   id: "DeployHandler",
//   // });

//   // Register contractAt with static addresses
//   const safe = m.contractAt("Safe", safeAddress);
//   const proxyFactory = m.contractAt("SafeProxyFactory", proxyFactoryAddress);
//   const handler = m.contractAt("CompatibilityFallbackHandler", handlerAddress);

//   // 6️⃣ Export all for later usage
//   return { singletonFactory, safe, proxyFactory, handler };
// });

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256, solidityPacked } from "ethers";

import SafeSingletonFactoryArtifact from "../../artifacts/contracts/SingletonFactory.sol/SingletonFactory.json" assert { type: "json" };
import SafeArtifact from "../../artifacts/contracts/Safe.sol/Safe.json" assert { type: "json" };
import SafeProxyFactoryArtifact from "../../artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json" assert { type: "json" };
import CompatibilityFallbackHandlerArtifact from "../../artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json" assert { type: "json" };

export default buildModule("SafeModule", (m) => {
  // Deploy the SingletonFactory
  const singletonFactory = m.contract("SingletonFactory");

  // Prepare init codes and salts
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

  // Get deterministic addresses (with unique IDs)
  const safeAddress = m.staticCall(
    singletonFactory,
    "getAddress",
    [safeInitCode, safeSalt],
    "GetSafeAddress"
  );

  const proxyFactoryAddress = m.staticCall(
    singletonFactory,
    "getAddress",
    [proxyFactoryInitCode, proxyFactorySalt],
    "GetProxyFactoryAddress"
  );

  const handlerAddress = m.staticCall(
    singletonFactory,
    "getAddress",
    [handlerInitCode, handlerSalt],
    "GetHandlerAddress"
  );

  // Deploy using the singleton factory
  m.call(singletonFactory, "deploy", [safeInitCode, safeSalt], {
    id: "DeploySafe",
  });
  m.call(singletonFactory, "deploy", [proxyFactoryInitCode, proxyFactorySalt], {
    id: "DeployProxyFactory",
  });
  m.call(singletonFactory, "deploy", [handlerInitCode, handlerSalt], {
    id: "DeployHandler",
  });

  // Reference deployed contracts
  const safe = m.contractAt("Safe", safeAddress);
  const proxyFactory = m.contractAt("SafeProxyFactory", proxyFactoryAddress);
  const handler = m.contractAt("CompatibilityFallbackHandler", handlerAddress);

  return { singletonFactory, safe, proxyFactory, handler };
});
