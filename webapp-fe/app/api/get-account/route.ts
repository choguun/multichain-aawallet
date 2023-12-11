import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
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

async function hashPassword (pin : any) {

  const password = pin;
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err : any, hash : any) {
      if (err) reject(err)
      resolve(hash)
    });
  })

  return hashedPassword
}

export async function GET(
  req: Request
) {
  try {
      // console.log(req);
      const { headers } : any = req;
      // ('headers : ', headers);
      const token = headers.get('authorization').replace('Bearer ', '');
      // console.log('token : ', token);

      const decodedToken = await jwt.decode(token, { complete: true });
      const signingKey = await getSigningKey(decodedToken?.header.kid);
      const decoded = await verifyToken(token, signingKey);
  
      const encPin = await hashPassword('');

      const account = await prisma.account.findUnique({
        where: {
          uid: String(decoded?.sub),
        }
      });

      if(!account) {
        return NextResponse.json('Not Found', { status: 404 })
      }

      return NextResponse.json(account);
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
