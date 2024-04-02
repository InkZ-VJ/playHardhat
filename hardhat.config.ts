import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const fs = require("fs");
import "@nomicfoundation/hardhat-verify";
import "./tasks/block_number.ts";

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";

let ETHERSCAN_API_KEY = fs.readFileSync(".etherscan").toString().trim();
let mnemonic = fs.readFileSync(".secret").toString().trim();
let infuraProjectID = fs.readFileSync(".infura").toString().trim();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraProjectID}`,
      accounts: {
        mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: false,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  solidity: "0.8.24",
};

export default config;
