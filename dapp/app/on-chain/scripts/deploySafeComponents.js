const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deploySafeComponents() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with: ${deployer.address}`);

  const SingletonFactory = await ethers.getContractFactory("SingletonFactory");
  const singletonFactory = await SingletonFactory.deploy();

  await singletonFactory.waitForDeployment();
  const singletonFactoryAddress = await singletonFactory.getAddress();

  const SafeTokensMock = await ethers.getContractFactory("SafeTokensMock");
  const safeTokens = await SafeTokensMock.deploy();
  await safeTokens.waitForDeployment();
  const safeTokensAddress = await safeTokens.getAddress();

  const Safe = await ethers.getContractFactory("Safe");
  const SafeProxyFactory = await ethers.getContractFactory("SafeProxyFactory");
  const CompatibilityFallbackHandler = await ethers.getContractFactory(
    "CompatibilityFallbackHandler"
  );

  const safeInitCode = Safe.bytecode;
  const proxyFactoryInitCode = SafeProxyFactory.bytecode;
  const handlerInitCode = CompatibilityFallbackHandler.bytecode;

  const safeSalt = ethers.keccak256(ethers.toUtf8Bytes("my-safe-singleton"));
  const proxyFactorySalt = ethers.keccak256(
    ethers.toUtf8Bytes("my-safe-proxy-factory")
  );
  const handlerSalt = ethers.keccak256(
    ethers.toUtf8Bytes("my-CompatibilityFallbackHandler")
  );

  // Compute deterministic addresses
  const safeAddress = ethers.getCreate2Address(
    singletonFactoryAddress,
    safeSalt,
    ethers.keccak256(safeInitCode)
  );
  const proxyFactoryAddress = ethers.getCreate2Address(
    singletonFactoryAddress,
    proxyFactorySalt,
    ethers.keccak256(proxyFactoryInitCode)
  );
  const handlerAddress = ethers.getCreate2Address(
    singletonFactoryAddress,
    handlerSalt,
    ethers.keccak256(handlerInitCode)
  );

  await (await singletonFactory.deploy(safeInitCode, safeSalt)).wait();
  await (
    await singletonFactory.deploy(proxyFactoryInitCode, proxyFactorySalt)
  ).wait();
  await (await singletonFactory.deploy(handlerInitCode, handlerSalt)).wait();

  const deploymentsDir = path.join(__dirname, "../ignition/deployments");
  const filePath = path.join(
    deploymentsDir,
    `chain-${network.config.chainId || 31337}`,
    "deployed_addresses.json"
  );

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const data = {
    "SafeModule#SingletonFactory": singletonFactoryAddress,
    "SafeModule#SafeSingleton": safeAddress,
    "SafeModule#SafeProxyFactory": proxyFactoryAddress,
    "SafeModule#FallbackHandler": handlerAddress,
    "SafeModule#SafeTokensMock": safeTokensAddress,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

deploySafeComponents().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deploySafeComponents.js --network localhost
