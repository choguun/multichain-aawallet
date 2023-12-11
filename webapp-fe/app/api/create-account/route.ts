import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import { ethers } from 'ethers';
import { Presets, Client } from 'userop';

import config from "../../../config.json";

const bcrypt = require('bcrypt');
const jwksClient = require('jwks-rsa');
const util = require('util');

const JWKS_URI = process.env.JWKS_URI!;

const verifyAsync = util.promisify(jwt.verify);
const jwksclient = jwksClient({
  jwksUri: JWKS_URI,
  requestHeaders: {}, // Optional
  timeout: 30000 // Defaults to 30s
});

const getSigningKey = async (kid: any) => {
  return new Promise((resolve, reject) => {
    jwksclient.getSigningKey(kid, (err: any, key: any) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key.publicKey || key.rsaPublicKey;
        resolve(signingKey);
      }
    });
  });
};

const verifyToken = async (token: any, signingKey: any) => {
  try {
    return await verifyAsync(token, signingKey);
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Token verification failed');
  }
};

export async function POST(
  req: Request
) {
  try {
    const { headers } : any = req;
    const body = await req.json();
    const { uid, email, wallet_name } = body;

    const token = headers.get('authorization').replace('Bearer ', '');
    const decodedToken = await jwt.decode(token, { complete: true });
    const signingKey = await getSigningKey(decodedToken?.header.kid);
    const decoded = await verifyToken(token, signingKey);
 
    if(decoded?.sub !== uid) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // key service
    const result = await axios.get(process.env.NEXT_PUBLIC_KEY_API_ENDPOINT!);

    const crypto_wallet_salt = result.data.crypto_wallet_salt;
    const crypto_wallet_address = result.data.crypto_wallet_address;
    const saving_wallet_salt = result.data.saving_wallet_salt;
    const saving_wallet_address = result.data.saving_wallet_address;
    const invest_wallet_salt = result.data.invest_wallet_salt;
    const invest_wallet_address = result.data.invest_wallet_address;

   await prisma.account.create({
        data: {
          uid: uid,
          // email: email,
          wallet_name: wallet_name,
          crypto_wallet_address: crypto_wallet_address,
          crypto_wallet_salt: crypto_wallet_salt,
          saving_wallet_address: saving_wallet_address,
          saving_wallet_salt: saving_wallet_salt,
          invest_wallet_address: invest_wallet_address,
          invest_wallet_salt: invest_wallet_salt
        },
    });

    return NextResponse.json({uid: uid}, { status: 200 });
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
