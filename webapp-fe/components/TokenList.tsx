'use client';

import Image from 'next/image';

export const TokenList = (props: any) => {
    const {tokens} = props;
    console.log(tokens);
    return (
        <>
           <div className="mb-10">
                {tokens.map((token: any) => {
                    return(
                    <div key={token.name} className="border-b p-2 border-black">
                        <div className="inline-block">
                            <Image src={token.logo} width={30} height={30} alt="" />
                        </div>
                        <div className="inline-block ml-2">
                            <span className="text-black font-semibold text-xl">
                                {token.name}
                            </span><br/>
                            <span>
                                ${Number(token.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </span>
                        </div>
                        <div className="inline-block float-right">
                            <span>${Number(token.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</span><br/>
                            <span>{Number(token.amount).toLocaleString(undefined, {minimumFractionDigits: 2})} {token.name === 'ethereum' ? 'eth ' : token.name}</span>
                        </div>
                    </div>
                    )
                })}
            </div> 
        </>
    )
};