import React from 'react';
import { useSession } from 'next-auth/react';

import Giveaways from '@/components/giveaways/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <div className='w-full font-animeace text-center my-12'>
        <p className='text-3xl md:text-7xl leading-tight text-gray-200 font-wintermouse'>SORTEOS</p>
        <p className='leading-relaxed text-xs md:text-md mt-4 text-gray-400'>El sorteo se programará una vez se alcance el 70% de los tickets vendidos</p>
      </div>
      <Giveaways session={session} />
    </section>
  );
}
