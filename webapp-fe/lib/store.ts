import { ethers } from "ethers";
import { Presets, ICall, Client, IClient } from "userop";
import accountAbi from "./abi.json";
import { getAccount } from './service';
import ERC20_ABI from '@/assets/abis/erc20.abi.json';
import AAVE_ABI from '@/assets/abis/aave.abi.json';
import SWAP_ABI from '@/assets/abis/swap.abi.json';
import ROUTER_ABI from '@/assets/abis/router.abi.json';
import config from '@/config.json';

const signingKey = process.env.NEXT_PUBLIC_SIGNING_KEY!;
// const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;
// const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL!;
const entryPoint = process.env.NEXT_PUBLIC_ENTRY_POINT!;
const factory = process.env.NEXT_PUBLIC_FACTORY!;

const paymasterUrlMumbai =  process.env.NEXT_PUBLIC_PAYMASTER_MUMBAI_URL!;
const paymasterUrlFuji =  process.env.NEXT_PUBLIC_PAYMASTER_FUJI_URL!;
const rpcUrlMumbai = process.env.NEXT_PUBLIC_BUNDLER_MUMBAI_URL!;
const rpcUrlFuji = process.env.NEXT_PUBLIC_BUNDLER_FUJI_URL!;

// const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const providerMumbai = new ethers.providers.JsonRpcProvider(rpcUrlMumbai);
const providerFuji = new ethers.providers.JsonRpcProvider(rpcUrlFuji);


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

const transfer = async (account: any, amount: any, network: any) => {
  const { crypto_wallet_address, crypto_wallet_salt } = account;

  let rpcUrl = network === 'mumbai' ? rpcUrlMumbai : rpcUrlFuji;
  let paymasterUrl = network === 'mumbai' ? paymasterUrlMumbai : paymasterUrlFuji;
  let provider = network === 'mumbai' ? providerMumbai : providerFuji;
  let chainSelector = network === 'mumbai' ? '14767482510784806043' : '14767482510784806043';

  const client = await Client.init(rpcUrl, {
      entryPoint: entryPoint
  });

  const paymasterMiddleware = paymasterUrl
  ? Presets.Middleware.verifyingPaymaster(paymasterUrl, {
      type: "payg",
    })
  : undefined;

  const simpleAccount = await Presets.Builder.SimpleAccount.init(
      new ethers.Wallet(signingKey),
      rpcUrl,
      {   
          paymasterMiddleware,
          entryPoint: entryPoint,
          factory: factory,
          salt: crypto_wallet_salt
      }
  );

  const tokenAddress = '0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40';
  const decimals = 18;
  const amount2 = ethers.utils.parseUnits(amount, decimals);

  let dest: Array<string> = [];
  let data: Array<string> = [];

  const lane = '0x19F2b3e2a630F7F2CC0E64dE96CfCBDd45ca51Fa';
  
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const laneContract = new ethers.Contract(lane, CCIP_ABI, provider);

    dest = [tokenContract.address, laneContract.address];
    data = [
      tokenContract.interface.encodeFunctionData("transfer", [lane, amount2]),
      laneContract.interface.encodeFunctionData("transferTokensPayLINK", [
        chainSelector,
        crypto_wallet_address,
        tokenAddress,
        amount2
      ]),
    ];

    const res = await client.sendUserOperation(
        simpleAccount.executeBatch(dest, data), {
          onBuild: (op) => console.log("Signed UserOperation:", op),
      });

    console.log(`UserOpHash: ${res.userOpHash}`);

    console.log("Waiting for transaction...");

    const ev = await res.wait();
    console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);


  return ev?.transactionHash ?? null;
};

export { transfer }