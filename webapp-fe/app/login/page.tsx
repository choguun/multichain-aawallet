'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const HankoAuth = dynamic(() => import('@/components/HankoAuth'), { ssr: false })

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="bg-gray-200 w-[600px]">
            <div className="bg-black text-center p-4">
                <span className="text-white inline-block float-left text-2xl font-semibold cursor-pointer" onClick={() => router.push('/')}>{'<'}</span>
                <span className="text-white inline-block text-xl font-semibold">Sign in/ Sign up</span>
            </div>
            <div className="mt-10 flex justify-center">
                <HankoAuth/>
            </div>
    </div>
    );
}