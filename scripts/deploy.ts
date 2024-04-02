import { ethers, run, network } from "hardhat";
const fs = require("fs");
const ETHERSCAN_API_KEY = fs.readFileSync(".etherscan").toString().trim();

const main = async () => {
  // Deploy contract
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  const contract_address = await simpleStorage.getAddress();
  console.log("Contract Deployed at Address:", contract_address);

  //console.log(network.config.chainId);
  //console.log(process.env.ETHERSCAN_API_KEY);
  // We only verify on a testnet!
  if (network.config.chainId === 11155111 && ETHERSCAN_API_KEY) {
    await verify(contract_address, []);
  } else {
    // Get the current value
    let currentValue = await simpleStorage.retrieve();
    console.log(`Current value: ${currentValue}`);

    // Update the value
    console.log("Updating contract...");
    let transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(); // returns transaction receipt
    currentValue = await simpleStorage.retrieve();
    console.log(`Current value: ${currentValue}`);
  }
};

const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
