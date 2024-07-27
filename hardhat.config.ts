import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import { config as dotenv } from "dotenv"
dotenv()

const accounts = [
  process.env.PRIVATE_KEY!,
]

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: {
      // allowUnlimitedContractSize: true,
    },
    optimismSepolia: {
      url: "https://sepolia.optimism.io",
      accounts,
    }
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: true,
    flat: true, 
  },
  etherscan: {
    apiKey: {
      optimismSepolia: process.env.ETHERSCAN_API_KEY!,
    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
            apiURL: "https://api-sepolia-optimism.etherscan.io/api",
            browserURL: "https://sepolia-optimism.etherscan.io"
        }
      },
    ]
  }
};

export default config;
