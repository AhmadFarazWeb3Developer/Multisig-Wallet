import { ethers } from "ethers";
import SafeArtifact from "../../app/on-chain/artifacts/contracts/Safe.sol/Safe.json";
import SafeProxyFactoryArtifact from "../../app/on-chain/artifacts/contracts/proxies/SafeProxyFactory.sol/SafeProxyFactory.json";
import CompatibilityFallbackHandlerArtifact from "../../app/on-chain/artifacts/contracts/handler/CompatibilityFallbackHandler.sol/CompatibilityFallbackHandler.json";
import SafeTokensMockArtifact from "../../app/on-chain/artifacts/contracts/SafeTokensMock.sol/SafeTokensMock.json";

const Interfaces = () => {
  const safeAbi = SafeArtifact.abi;
  const safeProxyFactoryAbi = SafeProxyFactoryArtifact.abi;
  const compatibilityFallbackHandlerAbi =
    CompatibilityFallbackHandlerArtifact.abi;
  const safeTokensMockAbi = SafeTokensMockArtifact.abi;

  const safeSingltonInterface = new ethers.utils.Interface(safeAbi);
  const safeProxyFactoryInterface = new ethers.utils.Interface(
    safeProxyFactoryAbi
  );
  const compatibilityFallbackHandlerInterface = new ethers.utils.Interface(
    compatibilityFallbackHandlerAbi
  );

  const safeTokensInterface = new ethers.utils.Interface(safeTokensMockAbi);

  return {
    safeSingltonInterface,
    safeProxyFactoryInterface,
    compatibilityFallbackHandlerInterface,
    safeTokensInterface,
  };
};

export default Interfaces;
