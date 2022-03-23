import {useRouter} from "next/router";
import React from 'react';
import {useQRCode} from 'next-qrcode';
import Link from 'next/link';

export default function QRDigits() {
    const {Canvas} = useQRCode();
    const router = useRouter();
    const dynamicUrl = router.query.id;

    return (
        <div className="flex flex-col items-center">
            <Link href={'/mint/' + dynamicUrl}>
                <div className="text-center font-black text-2xl mb-4">
                    Thanks for your purchase! Scan to mint your NFT and collect rewards!
                </div>
            </Link>
            <Canvas
                text={`localhost:3000/mint/${dynamicUrl}`}
                options={{
                    type: 'image/jpeg',
                    quality: 0.3,
                    level: 'M',
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                        dark: '#090000',
                        light: '#d4e4f8',
                    },
                }}
            />
        </div>
    );
}

