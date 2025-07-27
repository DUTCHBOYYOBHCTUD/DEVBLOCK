const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  // Deploy the PROKEN token
  const Token = await ethers.getContractFactory("Proken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("✅ Proken deployed to:", token.target);

  // Deploy the NFT contract with PROKEN token address as constructor arg
  const NFT = await ethers.getContractFactory("ProkenNFT");
  const nft = await NFT.deploy(token.target); // 👈 Pass token address here
  await nft.waitForDeployment();
  console.log("✅ ProkenNFT deployed to:", nft.target);

  // Save deployed addresses
  const output = {
    deployer: deployer.address,
    Proken: token.target,
    ProkenNFT: nft.target,
  };

  fs.writeFileSync(
    path.join(__dirname, "../deployed.json"),
    JSON.stringify(output, null, 2)
  );
  console.log("📦 Addresses saved to deployed.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
