'use client';

import { useState, useEffect, useCallback } from 'react';
import { TokenList } from '@/components/TokenList';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useQuery } from '@tanstack/react-query';
import ReactLoading from 'react-loading';
import { ethers } from 'ethers';
import erc20Abi from '@/assets/abis/erc20.abi.json';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { getAccount } from '@/lib/service';

const aggregatorV3InterfaceABI = [
    {
        "inputs": [],
        "name": "getChainlinkDataFeedLatestAnswer",
        "outputs": [
          {
            "internalType": "int256",
            "name": "",
            "type": "int256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const WalletPage = () => {
    const router = useRouter();

    const [savingWalletAddress, setSavingWalletAddress] = useState<string>('');
    const [cryptoWalletAddress, setCryptoWalletAddress] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [loading2, setLoading2] = useState(true);
    const [mumbaiBalance, setMumbaiBalance] = useState<number>(0);
    const [mumbaiTokenList, setMumbaiTokenList] = useState<any[]>([]);
    const [fujiBalance, setFujiBalance] = useState<number>(0);
    const [fujiTokenList, setFujiTokenList] = useState<any[]>([]);

    const sepoliaUSDCToken = '0x5425890298aed601595a70ab815c96711a31bc65';
    const mumbaiUSDCToken = '0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97';
    const fujiUSDCToken = '0x5425890298aed601595a70ab815c96711a31bc65';

    const sepoliaLinkToken = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
    const mumbaiLinkToken = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
    const fujiLinkToken = '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846';


    const mumbaiLinkPriceFeed = '0xEA0128f5339014D7a82d50444b902b10F3E00992';
    const fujiLinkPriceFeed =  '0xEA0128f5339014D7a82d50444b902b10F3E00992';


    const sepoliaProvider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.allthatnode.com/JWJzENK28XparEtnuPckDNf8XXFATyID');
    const mumbaiProvider = new ethers.providers.JsonRpcProvider('https://polygon-testnet-rpc.allthatnode.com:8545/JWJzENK28XparEtnuPckDNf8XXFATyID');
    const fujiProvider = new ethers.providers.JsonRpcProvider('https://avalanche-fuji-rpc.allthatnode.com/JWJzENK28XparEtnuPckDNf8XXFATyID/ext/bc/C/rpc');


    const getMumbaiAccountBalance = async () => {
        console.log('getMumbaiAccountBalance');

        const priceFeed = new ethers.Contract(mumbaiLinkPriceFeed, aggregatorV3InterfaceABI, mumbaiProvider);
        const erc20Link = new ethers.Contract(mumbaiLinkToken, erc20Abi, mumbaiProvider);  
        const erc20USDC = new ethers.Contract(mumbaiUSDCToken, erc20Abi, mumbaiProvider);

        console.log(await priceFeed.getChainlinkDataFeedLatestAnswer());

        const [balanceUSDC, decimalsUSDC, linkBalance, decimalLink, linkPrice] = await Promise.all([
            erc20USDC.balanceOf(cryptoWalletAddress),
            erc20USDC.decimals(),
            erc20Link.balanceOf(cryptoWalletAddress),
            erc20Link.decimals(),
            priceFeed.getChainlinkDataFeedLatestAnswer()
        ]);

        const totalBalance = Number(balanceUSDC/10**decimalsUSDC) + Number(linkBalance*linkPrice/10**decimalLink/100000000);
            
        let tokenList = [];

        tokenList.push({ name: "usdc" , amount: balanceUSDC/10**decimalsUSDC, balance: balanceUSDC/10**decimalsUSDC, price: 1, logo: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png' });
        tokenList.push({ name: "link", amount: linkBalance/10**decimalLink, balance: linkBalance*linkPrice/10**decimalLink/100000000, price: linkPrice/100000000, logo: 'https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png?1696502009' });

        setMumbaiTokenList(tokenList);
        setMumbaiBalance(totalBalance);

        return { tokenList, totalBalance };
    };

    const getFujiAccountBalance = async () => {
        console.log('getFujiAccountBalance');

        const priceFeed = new ethers.Contract(fujiLinkPriceFeed, aggregatorV3InterfaceABI, fujiProvider);
        const erc20Link = new ethers.Contract(fujiLinkToken, erc20Abi, fujiProvider);  
        const erc20USDC = new ethers.Contract(fujiUSDCToken, erc20Abi, fujiProvider);

        const [balanceUSDC, decimalsUSDC, linkBalance, decimalLink, linkPrice] = await Promise.all([
            erc20USDC.balanceOf(cryptoWalletAddress),
            erc20USDC.decimals(),
            erc20Link.balanceOf(cryptoWalletAddress),
            erc20Link.decimals(),
            priceFeed.getChainlinkDataFeedLatestAnswer()
        ]);

        const totalBalance = Number(balanceUSDC/10**decimalsUSDC) + Number(linkBalance*linkPrice/10**decimalLink/100000000);
            
        let tokenList = [];

        tokenList.push({ name: "usdc" , amount: balanceUSDC/10**decimalsUSDC, balance: balanceUSDC/10**decimalsUSDC, price: 1, logo: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png' });
        tokenList.push({ name: "link", amount: linkBalance/10**decimalLink, balance: linkBalance*linkPrice/10**decimalLink/100000000, price: linkPrice/100000000, logo: 'https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png?1696502009' });

        setFujiTokenList(tokenList);
        setFujiBalance(totalBalance);

        return { tokenList, totalBalance };
    };
  
    useEffect(() => {
        console.log(cryptoWalletAddress);
        const getCryptoBalance = async () => {
            setLoading2(true);
            try {
                console.log('getCryptoBalance');
                await Promise.all([
                    getMumbaiAccountBalance(),
                    getFujiAccountBalance()
                ])
                setLoading2(false);
            } catch(error : any) {
                console.error(error);
                // toast.error('Please wait 1-2 minute and refresh again. Exceed Coingecko API Limit');
            } finally {
                setLoading2(false);
            }
        };
        
        if(cryptoWalletAddress.length > 0) {
            getCryptoBalance();
        }

    }, [cryptoWalletAddress]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [savingWalletAddress],
        queryFn: async () => {
          const data = await getAccount();

          setSavingWalletAddress(data.saving_wallet_address);
          setCryptoWalletAddress(data.crypto_wallet_address);

          return data;
        },
        retry: 2,
        refetchInterval: 5000,
    });

    const error2: any = error;

    if(isError) {
        if(error2?.response?.data === "Not Found")
            router.push('/onboarding');
    }

    const onCopy = useCallback(() => {
        setCopied(true);
        toast.success('Copied to clipboard');
    }, [])

  return (
    <>
        <div className="bg-gray-200 w-[600px]">
            { (isLoading || loading2) &&
                 <ReactLoading className="absolute top-1/3 left-1/3 md:left-1/2 z-50" type="spin" height={100} width={100} color="grey" />
            }
            <div className="mt-2 mb-2 float-right pr-3">
                <span className="text-sm inline-block">Network: </span>
                <select className="text-sm border-1 rounded-md inline-block px-2 ml-2">
                    <option>All network (Mumbai, Fuji)</option>
                </select>
            </div><br/>
            <div className="px-4 py-1 mt-1 mb-2">
                {
                isLoading ? (
                    <Skeleton className="float-right" width={'75%'} count={1} />
                    ) : (
                    <>
                        <span className="text-black text-xl float-left pl-2">Hello, {data?.wallet_name}</span>
                    </>
                )}
            </div>
            <div className="p-6">
                {/* Wallet Card */}
                <div className="border border-neutral-500 mb-6 w-full rounded-xl bg-black min-h-[200px]">
                    <div className="p-5">
                        <div className="mb-3">
                            <div className="w-1/2 md:w-1/4 inline-block top-0">
                                <span className="text-white text-md top-0">
                                    Total Accounts
                                </span>  
                            </div>
                            <div className="w-1/2 md:w-3/4 inline-block">
                                {/* <CopyToClipboard onCopy={onCopy} text={savingWalletAddress}>
                                    <span className="text-white float-right text-xs cursor-pointer underline">Copy Wallet Address</span>
                                </CopyToClipboard> */}
                            </div>
                        </div>
                        <div>
                            <div className="w-1/2 md:w-1/4 inline-block">
                                <span className="text-white font-semibold text-2xl md:text-3xl">
                                    Balance:
                                </span>  
                            </div>
                            <div className="w-1/2 md:w-3/4 inline-block align-top">
                                {
                                isLoading ? (
                                    <Skeleton className="float-right" width={'75%'} count={1} />
                                    ) : (
                                    <>
                                        <span className="text-white font-semibold text-xl md:text-2xl float-right md:float-left md:ml-4">{(mumbaiBalance+fujiBalance).toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
                                        <br className="md:hidden" />
                                        <span className="hidden md:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        {/* <span className="text-green-500 text-xs md:text-sm float-right md:float-left md:ml-4"> APY : {APY.toLocaleString(undefined, {minimumFractionDigits: 2})} %</span> */}
                                    </>
                                )}
                            </div>
                        </div>
                        {/* <span className="text-xs md:text-sm text-white">
                            *Not include crypto wallet balance (showing <a href="https://kleva.io/main?t=lendnstake" target="_blank">oUSDC <Image className="inline-block" width={12} src={LogoKleva} alt="" /></a>)
                        </span> */}
                    </div>
                    <div className="w-full bg-gray-200 cursor-pointer">
                        {/* <span className="text-black text-md inline-block p-4 w-1/2 text-center" onClick={() => router.push('/wallet/pay')}>
                            Pay
                        </span> */}
                        <span className="px-4 border-l border-black text-black text-md inline-block p-4 w-full text-center" onClick={() => router.push('/wallet/transfer')}>
                            Transfer
                        </span>
                    </div>
                </div>
                <hr className="border-black border mb-4 w-full"/>
            </div>

            {/* Mumbai */}
            <div className="p-6 -mt-10">
                {/* Wallet Card */}
                <div className="border border-neutral-500 mb-6 w-full p-5 rounded-xl bg-black min-h-[200px]">
                    <div className="mb-3">
                        <span className="text-white text-md">
                            Mumbai Wallet
                        </span>
                        <CopyToClipboard onCopy={onCopy} text={cryptoWalletAddress}>
                            <span className="text-white float-right text-xs cursor-pointer underline">Copy Wallet Address</span>
                        </CopyToClipboard><br/>
                        <span className="mt-2 float-right">
                            {/* <a href="https://app.aave.com/faucet/" target="_blank">
                                <span className="text-xs underline text-white">faucet</span>
                            </a> */}
                            {/* <span className="text-xs underline text-white cursor-pointer" onClick={() => transak.init()}>Deposit via credit card</span> */}
                        </span>
                    </div>
                    <div>
                        <div className="w-1/4 md:w-1/4 inline-block">
                                <span className="text-white font-semibold text-2xl md:text-3xl">
                                    Balance:
                                </span>  
                        </div>
                        <div className="w-3/4 md:w-3/4 inline-block">
                            {
                            isLoading ? (
                                <Skeleton className="float-right" width={'75%'} count={1} />
                                ) : (
                                <>
                                <span className="text-white font-semibold text-xl md:text-2xl float-right">{mumbaiBalance.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        {/* <span className="text-xs md:text-sm text-white">
                            *Not include saving account balance (Show only some assets <a data-tooltip-id="my-tooltip" data-tooltip-content="MATIC, WETH, USDT, USDC"><FontAwesomeIcon icon={faCircleInfo}/></a>)
                            <Tooltip id="my-tooltip" />
                        </span> */}
                    </div>
                    <div className="w-full bg-gray-200 cursor-pointer mt-10 text-center">
                        <span className="text-black text-sm md:text-md inline-block p-4 w-1/2 text-center mx-auto" onClick={() => router.push('/wallet/transfer')}>
                            Transfer
                        </span>
                    </div>
                </div>
                {/* Token Balance List */}
                { mumbaiTokenList.length > 0 &&
                    <TokenList tokens={mumbaiTokenList}/>
                }
            </div>

            {/* Fuji */}
            <div className="p-6 -mt-10">
                {/* Wallet Card */}
                <div className="border border-neutral-500 mb-6 w-full p-5 rounded-xl bg-black min-h-[200px]">
                    <div className="mb-3">
                        <span className="text-white text-md">
                            Fuji Wallet
                        </span>
                        <CopyToClipboard onCopy={onCopy} text={cryptoWalletAddress}>
                            <span className="text-white float-right text-xs cursor-pointer underline">Copy Wallet Address</span>
                        </CopyToClipboard><br/>
                        <span className="mt-2 float-right">
                            {/* <a href="https://app.aave.com/faucet/" target="_blank">
                                <span className="text-xs underline text-white">faucet</span>
                            </a> */}
                            {/* <span className="text-xs underline text-white cursor-pointer" onClick={() => transak.init()}>Deposit via credit card</span> */}
                        </span>
                    </div>
                    <div>
                        <div className="w-1/4 md:w-1/4 inline-block">
                                <span className="text-white font-semibold text-2xl md:text-3xl">
                                    Balance:
                                </span>  
                        </div>
                        <div className="w-3/4 md:w-3/4 inline-block">
                            {
                            isLoading ? (
                                <Skeleton className="float-right" width={'75%'} count={1} />
                                ) : (
                                <>
                                <span className="text-white font-semibold text-xl md:text-2xl float-right">{fujiBalance.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        {/* <span className="text-xs md:text-sm text-white">
                            *Not include saving account balance (Show only some assets <a data-tooltip-id="my-tooltip" data-tooltip-content="MATIC, WETH, USDT, USDC"><FontAwesomeIcon icon={faCircleInfo}/></a>)
                            <Tooltip id="my-tooltip" />
                        </span> */}
                    </div>
                    <div className="w-full bg-gray-200 cursor-pointer mt-10 text-center">
                        <span className="text-black text-sm md:text-md inline-block p-4 w-1/2 text-center mx-auto" onClick={() => router.push('/wallet/transfer')}>
                            Transfer
                        </span>
                    </div>
                </div>
                {/* Token Balance List */}
                { fujiTokenList.length > 0 &&
                    <TokenList tokens={fujiTokenList}/>
                }
            </div>
            <NavBar path={'/wallet'}/>
        </div>
    </>
  )
}

export default WalletPage