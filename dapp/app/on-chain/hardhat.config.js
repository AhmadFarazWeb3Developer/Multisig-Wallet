require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      blockGasLimit: 30_000_000,
      gas: 12_000_000,
      allowUnlimitedContractSize: true,
      loggingEnabled: true,
      accounts: {
        count: 20,
        accountsBalance: "1000000000000000000000",
      },
    },
  },

  solidity: {
    compilers: [{ version: "0.8.13" }, { version: "0.8.20" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
