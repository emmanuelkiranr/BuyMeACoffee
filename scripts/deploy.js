async function main() {
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeAChai");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log(
    `Deployed the contract successfully to address: ${buyMeACoffee.address} `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
