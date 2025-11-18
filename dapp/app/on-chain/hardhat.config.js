require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",

  networks: {
    localhost: {
      allowUnlimitedContractSize: true,
      gas: 30_000_000,
      blockGasLimit: 30_000_000,
    },

    hardhat: {
      blockGasLimit: 30_000_000,
      gas: 30_000_000,
      allowUnlimitedContractSize: true,
      loggingEnabled: true,
      accounts: {
        count: 20,
        accountsBalance: "1000000000000000000000",
      },
    },
  },

  solidity: {
    compilers: [
      { version: "0.6.0" },
      { version: "0.7.6" },
      { version: "0.8.13" },
      { version: "0.8.20" },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
