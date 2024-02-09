import React from 'react';
import { useSession } from 'next-auth/react';

import Footer from '@/components/footer/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <footer>
      {session?.user && <Footer session={session} />}
    </footer>
  );
}
