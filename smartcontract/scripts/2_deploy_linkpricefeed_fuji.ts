const { ethers } = require("hardhat");

async function main() {
    const LinkPriceFeedFuji = await ethers.getContractFactory("LinkPriceFeedFuji");
    const linkPriceFeedFuji = await LinkPriceFeedFuji.deploy();
    // https://docs.stackup.sh/docs/entity-addresses
    await linkPriceFeedFuji.deployed();
  
    console.log("linkPriceFeedFuji address:", linkPriceFeedFuji.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });