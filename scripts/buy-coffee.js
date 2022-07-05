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

// logs the memos stored on chain from chai purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const address = memo.from;
    const timestamp = memo.timestamp;
    const name = memo.name;
    const message = memo.message;
    console.log(`At ${timestamp}, ${name} (${address}) said: "${message}"`);
  }
}

async function main() {
  // get test accounts
  const [owner, tipper, tipper2] = await hre.ethers.getSigners();

  // get the contract to deploy
  const Contract = await hre.ethers.getContractFactory("BuyMeAChai");

  // deploy the contract
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("contract successfully deployed to", contract.address);

  // check balances before the coffee purchase
  const addresses = [
    owner.address,
    tipper.address,
    tipper2.address,
    contract.address,
  ];
  console.log("=== Starting ===");
  await printBalances(addresses);

  // buy owner a few coffee
  const tip = { value: hre.ethers.utils.parseEther("1") }; // set a default tip value
  await contract.connect(tipper).buyChai("Emmanuel", "Hello World!", tip);
  await contract.connect(tipper2).buyChai("Godwin", "Hey! how are you?", tip);

  // check balance after the coffee purchase
  console.log("=== Buying coffee ===");
  await printBalances(addresses);

  // withdraw funds
  await contract.connect(owner).withdraw();

  // check balances after withdraw
  console.log("=== withdrawing tips ===");
  await printBalances(addresses);

  // read all the memos
  const memo = await contract.getMemos();
  printMemos(memo);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
