const { ethers } = require("hardhat");

async function main() {
    const TokenTransferor = await ethers.getContractFactory("TokenTransferor");
    
    const MumbaiToFujiLaneBnM = await TokenTransferor.deploy('0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40', '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'); // lane : mumbai to fuji
    await MumbaiToFujiLaneBnM.deployed();

    const MumbaiToFujiLaneLnM = await TokenTransferor.deploy('0xc1c76a8c5bfde1be034bbcd930c668726e7c1987', '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'); // lane : mumbai to fuji
    await MumbaiToFujiLaneLnM.deployed();

    const FujiToMumbaiLaneBnM = await TokenTransferor.deploy('0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4', '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846'); // lane : mumbai to fuji
    await FujiToMumbaiLaneBnM.deployed();

    const FujiToMumbaiLaneLnM = await TokenTransferor.deploy('0x70f5c5c40b873ea597776da2c21929a8282a3b35', '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846'); // lane : mumbai to fuji
    await FujiToMumbaiLaneLnM.deployed();

  
    console.log("MumbaiToFujiLaneBnM address:", MumbaiToFujiLaneBnM.address);
    console.log("MumbaiToFujiLaneLnM address:", MumbaiToFujiLaneLnM.address);

    console.log("FujiToMumbaiLaneBnM address:", FujiToMumbaiLaneBnM.address);
    console.log("FujiToMumbaiLaneLnM address:", FujiToMumbaiLaneLnM.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });