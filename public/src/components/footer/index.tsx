import React from 'react';
import Footer from './components/page';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();

  return (
    <footer>
      {session?.user && <Footer session={session} />}
    </footer>
  );
}
