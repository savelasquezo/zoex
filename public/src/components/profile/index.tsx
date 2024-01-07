import React, { useState } from "react";
import ProfileModal from './components/page';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();

  const [showModal, setShowModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);

  const closeModal = () => {
    setClosingModal(true);
    setTimeout(() => {
      setShowModal(false);
      setClosingModal(false);
    }, 500);
  };

  return (
    <section>
      <ProfileModal closeModal={closeModal} session={session} />
    </section>
  );
}
