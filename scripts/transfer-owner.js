// function that returns the ether balance of a given account
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// logs the ether balance for a list of address
async function printBalances(addresses) {
  let i = 0;
  for (const address of addresses) {
    console.log(`Address ${i} balance`, await getBalance(address));
    i++;
  }
}

async function main() {
  const [owner, tipper1, tipper2, newOwner] = await hre.ethers.getSigners();

  const Contract = await hre.ethers.getContractFactory("BuyMeAChai");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("Deployed to: ", contract.address);

  const addresses = [
    owner.address,
    tipper1.address,
    tipper2.address,
    newOwner.address,
    contract.address,
  ];

  console.log("=== Starting Balance ===");
  await printBalances(addresses);

  console.log("current contract owner", owner.address);

  const tip = { value: hre.ethers.utils.parseEther("1") }; // set a default tip value
  await contract.connect(tipper1).buyChai("Emmanuel", "Hello World!", tip);
  await contract.connect(tipper2).buyChai("Godwin", "Hey! how are you?", tip);

  console.log("=== Balance after buying coffee ===");
  await printBalances(addresses);

  console.log("changing owner...");
  await contract.updateOwner(newOwner.address); // changing owner
  console.log("successfully changed owner!");

  console.log("New contract owner", newOwner.address);

  // await contract.connect(owner).withdraw();
  // -  old owner trying to withdraw, this would only work if we havent called the updateOwner fn

  await contract.connect(newOwner).withdraw(); // new owner withdrawing

  console.log("=== Balances after withdrawing tips ===");
  await printBalances(addresses);

  console.log("New owner balance", await getBalance(newOwner.address));
  console.log("old owner balance", await getBalance(owner.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
