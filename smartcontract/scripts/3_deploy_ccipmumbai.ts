const { ethers } = require("hardhat");

async function main() {
    const TokenTransferor = await ethers.getContractFactory("TokenTransferor");
    
    const mumbaiRouter = await TokenTransferor.deploy('0x1035cabc275068e0f4b745a29cedf38e13af41b1', '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'); // lane : mumbai to fuji
    await mumbaiRouter.deployed();
  
    console.log("mumbaiRouter address:", mumbaiRouter.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });