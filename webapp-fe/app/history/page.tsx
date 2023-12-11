'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccount } from '@/lib/service';
import ReactLoading from 'react-loading';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { ethers } from 'ethers';
import HistoryList from '@/components/HistoryList';

const HistoryPage = () => {
    const router = useRouter();

    const [account, setAccount] = useState<any>({});
    const [savingWalletAddress, setSavingWalletAddress] = useState<string>('');
    const [cryptoWalletAddress, setCryptoWalletAddress] = useState<string>('');
    const [investWalletAddress, setInvestWalletAddress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [transactionData, setTransactionData] = useState<any>([]);

  
    useEffect(() => {
        const getAccountData = async () => {
            try {
                const data = await getAccount();    

               let account = {
                    crypto_wallet_address :  data.crypto_wallet_address,
                    saving_wallet_address : data.saving_wallet_address,
                    crypto_wallet_salt : data.crypto_wallet_salt,
                    saving_wallet_salt : data.saving_wallet_salt,
                };
                
                setAccount(account);
                setSavingWalletAddress(data.saving_wallet_address);
                setCryptoWalletAddress(data.saving_wallet_address);
                setInvestWalletAddress(data.invest_wallet_address);
                setLoading(false);
            } catch(error : any) {
                console.error(error);
                router.push('/login');
            }
        }
        // if(token.length > 0) {
          getAccountData();
        // }
      }, []);
    
    

    return (
        <div className="bg-gray-200 w-[600px]">
              {/* { loading &&
                 <ReactLoading className="absolute top-1/3 left-1/3 md:left-1/2 z-50" type="spin" height={100} width={100} color="grey" />
            }
            <div className="mt-3 mb-3 text-center">
                <span className="text-2xl font-semibold">History</span>
            </div>
            <div className="p-6">
                <span className="text-xl font-semibold">Saving Account Wallet</span><br/>
                <span className="underline mb-5"><a href={`https://mumbai.polygonscan.com/address/${savingWalletAddress}`} target="_blank">Explorer</a></span><br/><br/>
                <span className="text-xl font-semibold mt-5">Crypto Wallet</span><br/>
                <span className="underline"><a href={`https://mumbai.polygonscan.com/address/${cryptoWalletAddress}`} target="_blank">Explorer</a></span>
            </div> */}
              <div className="bg-gray-200 w-screen md:w-[600px]">
                { loading &&
                    <ReactLoading className="absolute top-1/3 left-1/3 md:left-1/2 z-50" type="spin" height={100} width={100} color="grey" />
                }
                <div className="bg-black text-center p-4">
                    <span className="text-white inline-block float-left text-2xl font-semibold cursor-pointer" onClick={() => router.push('/account')}>{'<'}</span>
                    <span className="text-white inline-block text-xl font-semibold">History</span>
                </div>
            <Tabs style={{"width": "100%"}}>
            <TabList style={{"width": "100%"}}>
            <Tab>Saving Account</Tab>
            <Tab>Crypto Wallet</Tab>
            <Tab>Invest Wallet</Tab>
            </TabList>
            <TabPanel>
                <div className="bg-gray-200 w-screen md:w-[600px]">
                    { !loading &&
                        <div>
                        <span className="underline pl-5"><a href={`https://mumbai.polygonscan.com/address/${savingWalletAddress}/#internaltx`} target="_blank">Explorer</a></span><br/><br/>
                        </div>
                    }
                    {/* <iframe src={`https://mumbai.polygonscan.com/address/${savingWalletAddress}/#internaltx`} className="w-full h-screen"></iframe> */}
                     {/* {transactionData.length > 0 ? (
                            <HistoryList transactions={transactionData} />
                        ) : (
                            <p className="text-gray-500 text-center">No recent transactions found.</p>
                        )} */}
                </div>
            </TabPanel>
            <TabPanel>
                { !loading &&
                    <div>
                        <span className="underline pl-5"><a href={`https://mumbai.polygonscan.com/address/${cryptoWalletAddress}/#internaltx`} target="_blank">Explorer</a></span>
                    </div>
                }
            </TabPanel>
            <TabPanel>
                { !loading &&
                    <div>
                        <span className="underline pl-5"><a href={`https://mumbai.polygonscan.com/address/${investWalletAddress}/#internaltx`} target="_blank">Explorer</a></span>
                    </div>
                }
            </TabPanel>
      </Tabs>
        </div>
            {/* Bottom Navbar */}
            {/* <NavBar path={'/history'} /> */}
        </div>
    )
}

export default HistoryPage