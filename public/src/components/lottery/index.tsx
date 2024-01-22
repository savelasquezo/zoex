import React, { useState } from "react";
import Lottery from './components/page';
import { useSession } from 'next-auth/react';


export default function Page() {
  const { data: session } = useSession();
  return (
    <section>
      <Lottery session={session} />
    </section>
  );
}
