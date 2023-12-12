import { ethers } from "ethers";

const CCIP_ABI = [
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_destinationChainSelector",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferTokensPayNative",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "messageId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_destinationChainSelector",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferTokensPayLINK",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "messageId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
  ];

async function main() {
  try {

    const signer = new ethers.Wallet('04fe32a98d4d7109152a1b01aab8c167b10e186a3b0a781ce3f5402399e076fa', new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/'));


    const laneContract = new ethers.Contract('0x315B128ac8604b266D9cc89Fe4B43CFbBC9A3c01', CCIP_ABI, signer);

    const amount = ethers.utils.parseUnits('0.1', 18);

    const tx = await laneContract.transferTokensPayLINK('14767482510784806043', '0x1D45D389E38Fd1b7c5D1BE163aA3baa4466d279b', '0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40', amount);

    console.log(tx);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();