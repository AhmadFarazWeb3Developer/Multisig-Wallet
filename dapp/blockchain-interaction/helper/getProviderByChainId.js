import { ethers } from "ethers";
import { getNetworkToken } from "./getNetworkToken";

export const getProviderByChainId = (chainId) => {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_RPC_API_KEY;

  const providers = {
    // Mainnets
    1: new ethers.providers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`
    ),
    137: new ethers.providers.JsonRpcProvider(
      `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`
    ),
    56: new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org/"
    ),
    42161: new ethers.providers.JsonRpcProvider(
      `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`
    ),
    10: new ethers.providers.JsonRpcProvider(
      `https://opt-mainnet.g.alchemy.com/v2/${apiKey}`
    ),
    43114: new ethers.providers.JsonRpcProvider(
      `https://avax-mainnet.g.alchemy.com/v2/${apiKey}`
    ),
    8453: new ethers.providers.JsonRpcProvider(
      `https://base-mainnet.g.alchemy.com/v2/${apiKey}`
    ),

    // Testnets
    11155111: new ethers.providers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`
    ),
    80002: new ethers.providers.JsonRpcProvider(
      "https://rpc-amoy.polygon.technology"
    ),
    97: new ethers.providers.JsonRpcProvider(
      `https://bnb-testnet.g.alchemy.com/v2/${apiKey}`
    ),
    421614: new ethers.providers.JsonRpcProvider(
      `https://arb-sepolia.g.alchemy.com/v2/${apiKey}`
    ),
    43113: new ethers.providers.JsonRpcProvider(
      `https://avax-fuji.g.alchemy.com/v2/${apiKey}`
    ),
    11155420: new ethers.providers.JsonRpcProvider(
      `https://opt-sepolia.g.alchemy.com/v2/${apiKey}`
    ),
    84532: new ethers.providers.JsonRpcProvider(
      `https://base-sepolia.g.alchemy.com/v2/${apiKey}`
    ),

    // Local
    31337: new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"),
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
