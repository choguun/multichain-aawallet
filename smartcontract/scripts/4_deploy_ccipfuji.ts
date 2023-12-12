const { ethers } = require("hardhat");

async function main() {
    const TokenTransferor = await ethers.getContractFactory("TokenTransferor");
    
    const FujiRouter = await TokenTransferor.deploy('0xf694e193200268f9a4868e4aa017a0118c9a8177', '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846'); // lane : mumbai to fuji
    await FujiRouter.deployed();;

    console.log("FujiRouter address:", FujiRouter.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });