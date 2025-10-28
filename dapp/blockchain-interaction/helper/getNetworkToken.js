export const getNetworkToken = (chainId) => {
  const tokens = {
    1: { symbol: "ETH", name: "Ether", decimals: 18 },
    11155111: { symbol: "ETH", name: "Sepolia Ether", decimals: 18 },
    5: { symbol: "ETH", name: "Goerli Ether", decimals: 18 },

    // Polygon networks
    137: { symbol: "MATIC", name: "Matic", decimals: 18 },
    80002: { symbol: "MATIC", name: "Amoy Matic", decimals: 18 },

    // BNB Chain
    56: { symbol: "BNB", name: "BNB", decimals: 18 },
    97: { symbol: "BNB", name: "Test BNB", decimals: 18 },

    // Arbitrum
    42161: { symbol: "ETH", name: "Ether", decimals: 18 },
    421614: { symbol: "ETH", name: "Sepolia Ether", decimals: 18 },

    // Optimism
    10: { symbol: "ETH", name: "Ether", decimals: 18 },
    11155420: { symbol: "ETH", name: "Sepolia Ether", decimals: 18 },

    // Avalanche
    43114: { symbol: "AVAX", name: "Avalanche", decimals: 18 },
    43113: { symbol: "AVAX", name: "Fuji Avalanche", decimals: 18 },

    // Base
    8453: { symbol: "ETH", name: "Ether", decimals: 18 },
    84532: { symbol: "ETH", name: "Sepolia Ether", decimals: 18 },

    // Fantom
    250: { symbol: "FTM", name: "Fantom", decimals: 18 },
    4002: { symbol: "FTM", name: "Test Fantom", decimals: 18 },

    // Gnosis
    100: { symbol: "xDAI", name: "xDAI", decimals: 18 },

    // Hardhat/Localhost
    31337: { symbol: "ETH", name: "Ether", decimals: 18 },
  };

  return (
    tokens[chainId] || { symbol: "ETH", name: "Native Token", decimals: 18 }
  );
};
