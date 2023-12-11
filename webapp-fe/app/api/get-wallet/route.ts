import { NextResponse } from 'next/server';
// TODO : on-chain
export async function POST(
  req: Request
) {
  try {
    return NextResponse.json({'account_name': 'test', 'saving_balance': 1000.00, 'crypto_balance': 1650.50, 'apy': 3.1});
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
