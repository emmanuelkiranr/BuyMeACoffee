const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeAChai.json");
const hre = require("hardhat");
async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  const contractAddress = "0x9078e1c55f455bb8a3db34f0b2044e078c49d20a";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.API_KEY
  );
  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  console.log(
    "current balance of the owner:",
    await getBalance(provider, signer.address),
    "ETH"
  );

  const contractBalance = await getBalance(provider, contract.address);

  console.log(
    "current balance of contract:",
    await getBalance(provider, contract.address),
    "ETH"
  );

  if (contractBalance !== "0.0") {
    console.log("Withdrawing funds...");
    const withdrawBalance = await contract.withdraw();
    await withdrawBalance.wait();
  } else console.log("No funds to withdraw");

  console.log(
    "current balance of the owner:",
    await getBalance(provider, signer.address),
    "ETH"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
