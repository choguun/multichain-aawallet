const { ethers } = require("hardhat");

async function main() {
    const TokenTransferor = await ethers.getContractFactory("TokenTransferor");
    
    const SepoliaRouter = await TokenTransferor.deploy('0x0bf3de8c5d3e8a2b34d2beeb17abfcebaf363a59', '0x779877A7B0D9E8603169DdbD7836e478b4624789'); // lane : sepolia to fuji
    await SepoliaRouter.deployed();

    console.log("FujiToMumbaiLaneBnM address:", SepoliaRouter.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });