import React from "react";
import { useSession } from 'next-auth/react';

import MiniLottery from '@/components/minilottery/components/page';

export default function Page() {
  const { data: session } = useSession();
  return (
    <section>
      <MiniLottery session={session} />
    </section>
  );
}
