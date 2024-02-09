import React from "react";
import { useSession } from 'next-auth/react';

import Lottery from '@/components/lottery/components/page';

export default function Page() {
  const { data: session } = useSession();
  return (
    <section>
      <Lottery session={session} />
    </section>
  );
}
