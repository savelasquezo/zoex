import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Auth from '@/components/auth/components/page';

import { SessionInfo } from '@/lib/types/types';

const Header: React.FC<SessionInfo> = ({ session  }) => {
  return (
    <header className="bg-gray-900 px-6 md:px-4 lg:px-2 py-2.5 h-14">
      <div className="flex flex-row justify-between items-center">
        <Link href="#" className="inline-flex text-center justify-center items-center w-32">
          <Image unoptimized width={405} height={200} src={"/assets/image/logo0.webp"} className="h-auto w-20 sm:h-9 object-fit self-start mr-4 z-10" alt="" />
        </Link>
        <Suspense fallback={<p>...</p>}>
          <Auth session={session} />
        </Suspense>
      </div>
  </header>
  );
};

export default Header;