import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import Authentication from './components/page';


export default function Header() {
  const { data: session } = useSession();
  return (
      <header className="bg-gray-900 border-gray-200 px-4 lg:px-2 py-2.5 h-14">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="#" className="inline-flex text-center justify-center items-center w-32">
            <Image width={405} height={200} src={"/assets/image/logo0.webp"} className="h-auto w-20 sm:h-9 object-fit self-start mr-4 z-10" alt="" />
          </Link>
          <Authentication session={session} />
        </div>
      </header>
  );
}


