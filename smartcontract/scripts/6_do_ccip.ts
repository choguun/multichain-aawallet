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

    const signer = new ethers.Wallet('04fe32a98d4d7109152a1b01aab8c167b10e186a3b0a781ce3f5402399e076fa', new ethers.providers.JsonRpcProvider('https://polygon-testnet-rpc.allthatnode.com:8545/JWJzENK28XparEtnuPckDNf8XXFATyID'));


    const laneContract = new ethers.Contract('0x4D3c9e9f2F484b60DA195Ea0E237b8f33E365CFB', CCIP_ABI, signer);

    const amount = ethers.utils.parseUnits('1', 18);
    const targetChainSelector = '14767482510784806043';
    const receiver = '0xA32B5821eaa4FaaD8B67944fCDed57C937d9B714';
    const tokenAddress = '0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40';

    const tx = await laneContract.transferTokensPayLINK(
      targetChainSelector,
      receiver,
      tokenAddress,
      amount
    );

    await tx.wait();
    console.log(tx);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();