import React, { useState } from "react";
import History from './components/page';

export default function Page() {

  const [showModal, setShowModal] = useState(false);
  return (
    <section>
      <History />
    </section>
  );
}
