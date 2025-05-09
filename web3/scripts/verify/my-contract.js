const hre = require("hardhat");

// to run the script:
//      npx hardhat run scripts/verify/my-contract.js --network zkSyncSepoliaTestnet

async function main() {
  const contractAddress = "0x487be678dd11a315e18af16d08f95c939b694d19"; // TODO: contract address
  const constructorArgs = []; // TODO: add constructor params here, if any

  console.log("Verifying contract.");
  await verify(
    contractAddress,
    "contracts/Cryp1N.sol:Cryp1N",
    constructorArgs
  );
}

async function verify(address, contract, args) {
  try {
    return await hre.run("verify:verify", {
      address: address,
      contract: contract,
      constructorArguments: args,
    });
  } catch (e) {
    console.log(address, args, e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
