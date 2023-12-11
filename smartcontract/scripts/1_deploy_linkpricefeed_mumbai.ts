const { ethers } = require("hardhat");

async function main() {
    const LinkPriceFeedMumbai = await ethers.getContractFactory("LinkPriceFeedMumbai");
    const linkPriceFeedMumbai = await LinkPriceFeedMumbai.deploy();
    // https://docs.stackup.sh/docs/entity-addresses
    await linkPriceFeedMumbai.deployed();
  
    console.log("linkPriceFeedMumbai address:", linkPriceFeedMumbai.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });