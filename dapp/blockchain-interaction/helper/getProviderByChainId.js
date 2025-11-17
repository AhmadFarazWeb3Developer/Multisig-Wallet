import { ethers } from "ethers";
import { getNetworkToken } from "./getNetworkToken";

export const getProviderByChainId = (chainId) => {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_RPC_API_KEY;

  console.log("🔍 Creating provider for chainId:", chainId);

  // Auto-detect: Using localhost on PC, using PC's IP on mobile
  const getLocalRpcUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      // If hostname is an IP address (mobile accessing PC)
      if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return `http://${hostname}:8545`;
      }
    }

    return "http://127.0.0.1:8545";
  };

  const localRpcUrl = getLocalRpcUrl();

  const providers = {
    // Mainnets
    // 1: new ethers.providers.JsonRpcProvider(
    //   `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 137: new ethers.providers.JsonRpcProvider(
    //   `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 56: new ethers.providers.JsonRpcProvider(
    //   "https://bsc-dataseed.binance.org/",
    //   'any'
    // ),
    // 42161: new ethers.providers.JsonRpcProvider(
    //   `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 10: new ethers.providers.JsonRpcProvider(
    //   `https://opt-mainnet.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 43114: new ethers.providers.JsonRpcProvider(
    //   `https://avax-mainnet.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 8453: new ethers.providers.JsonRpcProvider(
    //   `https://base-mainnet.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),

    // Testnets
    // 11155111: new ethers.providers.JsonRpcProvider(
    //   `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 80002: new ethers.providers.JsonRpcProvider(
    //   "https://rpc-amoy.polygon.technology",
    //   'any'
    // ),
    // 97: new ethers.providers.JsonRpcProvider(
    //   `https://bnb-testnet.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 421614: new ethers.providers.JsonRpcProvider(
    //   `https://arb-sepolia.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 43113: new ethers.providers.JsonRpcProvider(
    //   `https://avax-fuji.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 11155420: new ethers.providers.JsonRpcProvider(
    //   `https://opt-sepolia.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),
    // 84532: new ethers.providers.JsonRpcProvider(
    //   `https://base-sepolia.g.alchemy.com/v2/${apiKey}`,
    //   'any'
    // ),

    // Local - Auto-detects localhost vs IP
    31337: new ethers.providers.JsonRpcProvider(localRpcUrl, "any"),
  };

  const provider = providers[chainId] || null;

  if (provider) {
    console.log("Provider created successfully with:", localRpcUrl);
  } else {
    console.error("No provider found for chainId:", chainId);
  }

  return provider;
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
