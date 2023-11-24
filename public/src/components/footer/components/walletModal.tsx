import React from 'react';
import { Session } from 'next-auth';

type WalletModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
};
  
const WalletModal: React.FC<WalletModalProps> = ({ closeModal, session  }) => {

  return (
    <div>
        <p>WalletModal</p>
  </div>
  );
};

export default WalletModal;
