const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`🧑 Deployer: ${deployer.address}`);

  const nftAddress = require("../deployed.json").ProkenNFT;
  const nft = await ethers.getContractAt("ProkenNFT", nftAddress);

  const ipfsURIs = [
    "ipfs://bafkreiaqjpfkemi3ig674ajlrpbk2w4p23mmt3gqkkeb5vew5mxge2gygi",
    "ipfs://bafkreigjwn2oonzce5kttnkzibabrj4iogfldvqm3ift5js2ay5hn3rga4",
    "ipfs://bafkreifrliqmdm7nui57sebua6im3yanlddvgqdh6o2cwtkfvs7ugfob5y",
    "ipfs://bafkreid7bhzzy7is5itjsk3p7gn5tve4pqwrhv2yael6yajpw7rt3u6pcu",
    "ipfs://bafkreibknmcmvg7h6tznblzq6nh5t4v3civvsfbmtge7kyigmmqksbyvmm"
  ];

  const prices = [
    ethers.parseUnits("100", 18),
    ethers.parseUnits("200", 18),
    ethers.parseUnits("300", 18),
    ethers.parseUnits("400", 18),
    ethers.parseUnits("500", 18),
  ];

  for (let i = 0; i < prices.length; i++) {
    const tx = await nft.mintNFT(ipfsURIs[i], prices[i]);
    const receipt = await tx.wait();

    // Optional: Log the token ID from the event (if you emit it)
    console.log(`✅ Minted NFT ${i + 1}: ${ipfsURIs[i]} | Price: ${ethers.formatUnits(prices[i], 18)} $PROKEN`);
  }

  console.log("🎉 All NFTs minted and priced!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
