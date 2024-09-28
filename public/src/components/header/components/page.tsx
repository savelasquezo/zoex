import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Auth from '@/components/auth/components/page';
import KickModal from '@/components/header/components/kickModal';

import { SessionInfo } from '@/lib/types/types';

const Header: React.FC<SessionInfo> = ({ session  }) => {
  return (
    <section className="bg-gray-900 px-6 md:px-4 lg:px-2 py-2.5 h-14">
      <KickModal/>
      <div className="flex flex-row justify-between items-center">
        <Link href="#" className="inline-flex text-center justify-center items-center w-32">
          <Image priority width={240} height={120} src={"/assets/image/logo0.webp"} className="h-9 w-auto object-fit self-start mr-4 z-10" alt="" />
        </Link>
        <Suspense fallback={null}>
          <Auth session={session} />
        </Suspense>
      </div>
  </section>
  );
};

export default Header;