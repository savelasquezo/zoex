import React, { Suspense } from 'react';
import { useSession } from 'next-auth/react';

import Header from './components/page';

export default function Page() {
  const { data: session } = useSession();
  return (
    <header>
      <Header session={session} />
    </header>
  );
}


