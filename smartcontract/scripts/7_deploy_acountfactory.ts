const { ethers } = require("hardhat");

async function main() {
    const SimpleAccountFactory = await ethers.getContractFactory("SimpleAccountFactory");
    // mumbai router = 0x1035cabc275068e0f4b745a29cedf38e13af41b1
    // fuji router = 0xf694e193200268f9a4868e4aa017a0118c9a8177
    const simpleFactory = await SimpleAccountFactory.deploy('0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'); // Entry point contract
    // https://docs.stackup.sh/docs/entity-addresses
    await simpleFactory.deployed();
  
    console.log("Simple Factory address:", simpleFactory.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });