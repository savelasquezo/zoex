import React from "react";
import { useSession } from 'next-auth/react';

import Lottery from '@/components/lottery/components/page';

export default function Page() {
  const { data: session } = useSession();
  return (
    <section>
      <p className='w-full text-center text-7xl font-animeace text-gray-200 mt-8 mb-12'>Loterias</p>
      <Lottery session={session} />
    </section>
  );
}
