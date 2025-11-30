const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const safeAddress = "0x20082426febbb3c576237e2cbbbf5bd0c263a492";

  console.log("Funding Safe from:", signer.address);
  console.log("Safe address:", safeAddress);

  const tx = await signer.sendTransaction({
    to: safeAddress,
    value: hre.ethers.parseEther("200"),
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
