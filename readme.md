
# Multi chain Account Abstraction

A Non-custodian Multi-Chain Smart Wallet helping web2 users to easily and 
securely access web3 by account abstraction wallet(ERC4337), passkey and CCIP.

## Project Structure

- webapp-fe
```
webapp-fe is frontend, It built with NextJS, Ethers, passkey and integrate with stackup infrastructure for erc4337(Bundler and Paymaster)
```
- smartcontract
```
smartcontract is contract in solidity, It contains of factory and account countract that use erc4337 standard, Price Feeder for Mumbai and Fuji, CCIP Contract
```