import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    truffledashboard: {
      url: "http://localhost:24012/rpc"
    },
    mumbai: {
      url: process.env.RPC_MUMBAI!,
      accounts: [process.env.KEY!]
    },
    fuji: {
      url: process.env.RPC_FUJI!,
      accounts: [process.env.KEY!]
    }
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  }
};

export default config;
