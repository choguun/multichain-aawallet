import React from 'react'
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import LogoWallet from '@/assets/logos/multichain-aawallet.png';

const Index = () => {
  return (
    <div className="bg-gray-200 w-[600px]">
    <nav className="mb-3 p-4">
      <span className="text-black font-bold inline-block">
          Multichain AA Wallet
      </span>
      <div className="float-right inline-block">
          <Link href={'/login'}>
            <Button>Sign in/ Sign up</Button>
          </Link>
      </div>
    </nav>
      <div className="p-6">
        <div className="mt-3">
          <Image className="mx-auto" src={LogoWallet} alt='' width={150} height={150} />
        </div>
        <div className="mt-5 text-center">
          <p>
            A smart wallet that utilizes ERC-4337 standard(account abstraction) and passkey to increase user experience, it is easily to use and secure to onboard web2 users to web3. It has features like a savings account, multi-wallet, simplify to invest in DeFi Protocols, and daily use to pay merchants with a smart wallet.
          </p>
          <br/>
          <Link href={'/login'}>
            <Button>Get Started</Button>
          </Link>
        </div>
        <div className="mt-8">
          <b className="text-xl">Features</b><br/>

        -Seedless, Keyless and Passwordless<br/>

        -Multi Smart Wallet<br/>

        -Open Saving account wallet<br/>

        -Show crypto balances<br/>

        -Gasless and Gas Abstraction with Paymaster
        </div>
        <div className="mt-5">
        <b className="text-xl">Road Map</b><br/>
  <b> Phase 1</b><br/>
-Build Web App<br/>
-Supported EVM Multi-Chain<br/>
-Paymaster and Gas Abstraction<br/>
-Zap to invest, staking, swap<br/>
-Embedded AA Wallet & SDK<br/>
-Private key on Secure Enclave<br/>
-On-ramp by credit cards<br/><br/>
  <b> Phase 2</b><br/>
  -Mobile Apps<br/>
-NFT Features<br/>
-Other on-ramp solutions<br/>
-Off-ramp solutions<br/>
-Integrate with more DeFis<br/>
  -Integrate with RWA<br/>
        </div>
      </div>
      <div className="mt-1 mb-3 px-6">
        {/* <span className="text-md font-semibold text-black">
          Pitch Deck: 
        </span>
        <Link target="_blank" href={'https://drive.google.com/file/d/18GtINykr9XI_jAePQgtPN_moV0IwrXjZ/view?usp=sharing'}>
          <span className="ml-3 text-md font-bold text-black cursor-pointer">
            Link
          </span>
        </Link> */}
      </div>
      <footer className="bg-black">
        <div className="p-4">
          <div className="mt-3">
            <div className="text-center">
              <span className="text-white font-bold inline-block">
                Multichain AA Wallet
              </span>
            </div>
            <div className="mt-3 text-center">
              <span className="text-white font-bold inline-block">
                  © 2023 Multichain AA Wallet<br/>
                  for only chainlink hackathon
              </span>
            </div>
            <div className="mt-3 text-center">
              <span className="text-white font-bold inline-block">
                  Want to invest contact: visaruth.s@gmail.com
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index