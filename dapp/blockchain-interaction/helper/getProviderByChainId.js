import { ethers } from "ethers";
import { getNetworkToken } from "./getNetworkToken";

export const getProviderByChainId = (chainId) => {
  const providers = {
    // Mainnets
    1: new ethers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    137: new ethers.JsonRpcProvider(
      `https://polygon-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    56: new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/"),
    42161: new ethers.JsonRpcProvider(
      `https://arb-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    10: new ethers.JsonRpcProvider(
      `https://opt-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    43114: new ethers.JsonRpcProvider(
      `https://avax-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    8453: new ethers.JsonRpcProvider(
      `https://base-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),

    // Testnets
    11155111: new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    80002: new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology"),
    97: new ethers.JsonRpcProvider(
      `https://bnb-testnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    421614: new ethers.JsonRpcProvider(
      `https://arb-sepolia.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    43113: new ethers.JsonRpcProvider(
      `https://avax-fuji.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    11155420: new ethers.JsonRpcProvider(
      `https://opt-sepolia.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),
    84532: new ethers.JsonRpcProvider(
      `https://base-sepolia.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_RPC_API_KEY
      }`
    ),

    // Local
    31337: new ethers.JsonRpcProvider("http://127.0.0.1:8545"),
  };

  return providers[chainId] || null;
};

export const getNetworkName = (chainId) => {
  const names = {
    1: "Ethereum Mainnet",
    137: "Polygon",
    56: "BNB Chain",
    42161: "Arbitrum One",
    10: "Optimism",
    43114: "Avalanche",
    8453: "Base",
    250: "Fantom",
    100: "Gnosis",
    11155111: "Sepolia",
    80002: "Polygon Amoy",
    97: "BNB Testnet",
    421614: "Arbitrum Sepolia",
    43113: "Avalanche Fuji",
    11155420: "Optimism Sepolia",
    84532: "Base Sepolia",
    31337: "Hardhat",
  };

  return names[chainId] || "Unknown Network";
};

export { getNetworkToken };
