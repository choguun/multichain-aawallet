'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { transfer } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import erc20Abi from '@/assets/abis/erc20.abi.json';
import toast from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { getAccount } from '@/lib/service';
import { supported, create, get } from "@github/webauthn-json";
import { nanoid } from "nanoid";

const ERC20ABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const WithdrawPage = () => {
    const router = useRouter();

    // const [token, setToken] = useState<string>('');
    const [account, setAccount] = useState<any>({});
    const [amount, setAmount] = useState<number>(0);
    const [cryptoWalletAddress, setCryptoWalletAddress] = useState<string>('');
    const [usdCBalance, setUSDCBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedNetwork, setSelectedNetwork] = useState<string>('');
    const [lane, setLane] = useState<string>('');
    const [source, setSource] = useState<string>('');
    const [selectedAsset, setSelectedAsset] = useState<string>('');
    const [destNetwork, setDestNetwork] = useState<string>('');

    const clean = (str: any) => {
        return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
      
    const generateChallenge = () => {
        return clean(btoa(nanoid(32)));
    }

    const transferCCIP = async () => {
        const challenge = generateChallenge();

        try {
            const credential = await get({
                publicKey: {
                challenge,
                timeout: 60000,
                userVerification: "required",
                rpId: process.env.NEXT_PUBLIC_DOMAIN!,
                },
            });

            if(credential?.response.signature.length > 0) {
                setLoading(true);
                const result = await transfer(account, amount, selectedNetwork, lane, source);
                toast.success(`Transaction hash: ${result}`);
                router.push('/wallet');
            } else {
                toast.error(`Try Again.`);
            }
        } catch(error : any) {
            console.error(error);
            toast.error(error?.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleInputAmountChange = (event : any) => {
        setAmount(event.target.value);
    };

    const handleSelectedNetworkChanged = (event : any) => {
        const network = event.target.value;
        setSelectedNetwork(network);

        const destNetwork = network === 'mumbai' ? 'fuji' : 'mumbai';
        setDestNetwork(destNetwork);

        const l = network === 'mumbai' ? '0xA439489DF6f6A00b8EB7972FD97E4534b8A7941c' : '0xA439489DF6f6A00b8EB7972FD97E4534b8A7941c';
        const s = network === 'mumbai' ? '0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97' : '0x5425890298aed601595a70ab815c96711a31bc65';

        setLane(l);
        setSource(s);
    };

    const handleSelectedAssetChanged = (event : any) => {
        setSelectedAsset(event.target.value);
    };

    useEffect(() => {
        const getAccountData = async () => {
            try {
                const data = await getAccount();    

                let account = {
                    crypto_wallet_address:  data.crypto_wallet_address,
                    saving_wallet_address: data.saving_wallet_address,
                    invest_wallet_address: data.invest_wallet_address,
                    crypto_wallet_salt: data.crypto_wallet_salt,
                    saving_wallet_salt: data.saving_wallet_salt,
                    invest_wallet_salt: data.invest_wallet_salt
                };
                
                setAccount(account);
                setCryptoWalletAddress(data.crypto_wallet_address);
            } catch(error : any) {
                console.error(error);
                router.push('/login');
            }
        }
        // if(token.length > 0) {
            getAccountData();
        // }
    }, []);


    useEffect(() => {
        const getCryptoBalance = async () => {
            setLoading(true);
            console.log('getCryptoBalance');

            const rpcUrl = selectedNetwork === 'mumbai' ? process.env.NEXT_PUBLIC_RPC_MUMBAI_URL: process.env.NEXT_PUBLIC_RPC_FUJI_URL;
            const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

            const tokenAddress = selectedNetwork === 'mumbai' ? '0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97' : '0x5425890298aed601595a70ab815c96711a31bc65';
            
            const erc20USDC = new ethers.Contract(tokenAddress, ERC20ABI, provider);

            const [tokenBalance, tokenDecimals] = await Promise.all([
                erc20USDC.balanceOf(cryptoWalletAddress),
                erc20USDC.decimals(),
            ]);

            setUSDCBalance(tokenBalance/10**tokenDecimals);
            setLoading(false);
       };

        if(cryptoWalletAddress.length > 0 && selectedNetwork.length > 0 && selectedAsset.length > 0) {
            getCryptoBalance();
        }

    }, [cryptoWalletAddress, selectedNetwork, selectedAsset]);


    return (
        <div className="bg-gray-200 w-[600px]">
             { loading &&
                 <ReactLoading className="absolute top-1/3 left-1/3 md:left-1/2 z-50" type="spin" height={100} width={100} color="grey" />
            }
            <div className="bg-black text-center p-4">
                <span className="text-white inline-block float-left text-2xl font-semibold cursor-pointer" onClick={() => router.push('/wallet')}>{'<'}</span>
                <span className="text-white inline-block text-xl font-semibold">Transfer</span>
            </div>
            <div className="p-6">
                <div className="bg-white p-4 rounded-md">
                    <span className="text-xl font-semibold mt-3 mb-3">From Wallet:</span><br/>
                    <div className="mt-3 mb-3">
                        <span className="inline-block">Network : </span>
                        <select className="inline-block border border-black p-1 ml-2 w-[150px]" value={selectedNetwork} onChange={handleSelectedNetworkChanged}>
                            <option value="">
                                Please select
                            </option>
                            <option value="mumbai">
                                Mumbai
                            </option>
                            <option value="Fuji">
                                Fuji
                            </option>
                        </select>
                    </div>
                    <div className="mt-3 mb-3">
                        <span className="inline-block">Asset : </span>
                        <select className="inline-block border border-black p-1 ml-2 w-[150px]" value={selectedAsset} onChange={handleSelectedAssetChanged}>
                            <option>
                                Please select
                            </option>
                            <option value="usdc">
                                USDC
                            </option>
                            {/* <option value="link">
                                LINK
                            </option> */}
                        </select>
                    </div>
                    <div className="mt-3 mb-3">
                        <span className="inline-block">Avaliable : </span>
                        <span>{usdCBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="mt-3 mb-3">
                        <span className="inline-block">Amount : </span>
                        <input className="border-black border p-1 ml-2 w-[150px]" type="number" min="1" max={usdCBalance} value={amount} onChange={handleInputAmountChange}></input>
                    </div>
                    <span className="text-xl font-semibold mt-3 mb-3">To Wallet:</span><br/>
                    <div className="mt-3 mb-3">
                        <span className="inline-block">Network : </span>
                        <select className="inline-block border border-black p-1 ml-2 w-[150px] disabled" value={destNetwork} disabled>
                            <option>

                            </option>
                            <option value="mumbai">
                                Mumbai
                            </option>
                            <option value="fuji">
                                Fuji
                            </option>
                        </select>
                    </div>
                    <Button className="w-full p-2 mt-2" onClick={()=> transferCCIP()}>Transfer by CCIP</Button>
                </div>
            </div>
        </div>
    )
}

export default WithdrawPage