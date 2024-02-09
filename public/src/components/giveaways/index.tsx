import React from 'react';
import { useSession } from 'next-auth/react';

import Giveaways from '@/components/giveaways/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Giveaways session={session} />
    </section>
  );
}
