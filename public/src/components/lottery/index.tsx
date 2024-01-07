import React, { useState } from "react";
import Lottery from './components/page';
import { useSession } from 'next-auth/react';


export default function Page() {
  const { data: session } = useSession();

  const [showModal, setShowModal] = useState(false);
  return (
    <section>
      <Lottery session={session} />
    </section>
  );
}
