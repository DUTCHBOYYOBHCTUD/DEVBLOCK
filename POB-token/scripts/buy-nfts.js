const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [buyer] = await ethers.getSigners();
  const addresses = require("../deployed.json");
  const nftAddress = addresses.ProkenNFT;

  // Load NFT contract
  const nft = await ethers.getContractAt("ProkenNFT", nftAddress);

  const tokenIdToBuy = 1;

  // Fetch price for the token
  const price = await nft.nftPrices(tokenIdToBuy);
  console.log(`💰 Buying NFT ${tokenIdToBuy} for ${ethers.formatUnits(price, 18)} PROKEN`);

  // Get token address from contract (custom stored)
  const tokenAddress = await nft.prokenToken();
  const proken = await ethers.getContractAt("IERC20", tokenAddress);

  // Approve NFT contract to spend tokens on behalf of buyer
  const approveTx = await proken.approve(nftAddress, price);
  await approveTx.wait();
  console.log(`✅ Approved NFT contract to spend ${ethers.formatUnits(price, 18)} PROKEN`);

  // Call buyNFT
  const buyTx = await nft.buyNFT(tokenIdToBuy);
  await buyTx.wait();
  console.log(`🎉 NFT ${tokenIdToBuy} bought successfully by ${buyer.address}`);
}

main().catch((err) => {
  console.error("❌ Error buying NFT:", err);
  process.exit(1);
});
