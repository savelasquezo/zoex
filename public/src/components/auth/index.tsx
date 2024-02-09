import React from "react";
import { useSession } from 'next-auth/react';

import Auth from '@/components/auth/components/page';

export default function Page() {
  const { data: session } = useSession();

  return (
    <section>
      <Auth session={session} />
    </section>
  );
}
