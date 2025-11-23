const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const safeAddress = "0xbc4DD66209dF49fA3DEE9FF921ce0e7B1286e4F6";

  console.log("Funding Safe from:", signer.address);
  console.log("Safe address:", safeAddress);

  const tx = await signer.sendTransaction({
    to: safeAddress,
    value: hre.ethers.parseEther("1.0"),
  });

  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Safe funded!");

  const balance = await hre.ethers.provider.getBalance(safeAddress);
  console.log("Safe balance:", hre.ethers.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
