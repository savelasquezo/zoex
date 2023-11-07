'use client';

import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
    return (
        <Link href="#" className="inline-flex text-center justify-center items-center w-32">
            <Image width={405} height={200} src={"/assets/image/logo.webp"} className="h-auto w-24 sm:h-9 object-fit self-start mr-4 z-10" alt="" />
        </Link>
      );
}

export default Logo