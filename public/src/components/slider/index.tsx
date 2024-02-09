import React from 'react';
import { useSession } from 'next-auth/react';

import Slider from '@/components/slider/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Slider session={session} />
    </section>
  );
}
