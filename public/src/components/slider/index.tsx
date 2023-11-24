import React from 'react';
import Slider from './components/page';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();
  return (
    <section>
      <Slider session={session} />
    </section>
  );
}
