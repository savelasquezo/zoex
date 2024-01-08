import React from 'react';
import Giveaways from './components/page';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Giveaways session={session} />
    </section>
  );
}
