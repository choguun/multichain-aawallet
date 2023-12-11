import type { Metadata } from 'next'
import { IBM_Plex_Sans_Thai_Looped } from 'next/font/google';
import './globals.css';
import 'react-tooltip/dist/react-tooltip.css'
import { ToasterProvider } from '@/components/toaster-provider';
import Providers from '@/components/Providers';

const font = IBM_Plex_Sans_Thai_Looped({
  subsets: ["latin", "thai"],
  weight: ['100','200','300','400','500','600','700'],
  variable: '--font-ibm',
});

export const metadata: Metadata = {
  title: 'Non Custodian Multi-Chain Smart Wallet by Account Abstraction and Passkey',
  description: 'Non Custodian Multi-Chain Smart Wallet by Account Abstraction and Passkeyt',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" />
          <title>
            Non Custodian Multi-Chain Smart Wallet by Account Abstraction and Passkey
          </title>
          <link rel="icon" type="image/x-icon" href="./icon.png"></link>
        </head>
        <body className={font.className}>
          <ToasterProvider />
          {children}
        </body>
      </html>
    </Providers>
  )
}
