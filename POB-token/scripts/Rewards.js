const hre = require("hardhat");
const { parseUnits, formatUnits } = require("ethers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const prokenToken = await hre.ethers.getContractAt("Proken", "0x0c8432F1680BD45aF1C2f3E316f8750aE2813Dab");

  const userAddress = "0xB53f3bA7F04191BB353813350361d05A472dEAed"; // Replace with your MetaMask address
  const rewardAmount = parseUnits("1000", 18); // Give yourself 1000 PROKEN

  const tx = await prokenToken.transfer(userAddress, rewardAmount);
  await tx.wait();

  console.log(`✅ Sent ${formatUnits(rewardAmount, 18)} $PROKEN to ${userAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



