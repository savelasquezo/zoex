import React, { useEffect, useState } from 'react';

import LinkReferedModal from "@/components/share/components/linkReferedModal";
import HistoryReferedModal from "@/components/share/components/historyReferedModal";
import { SessionModal } from '@/lib/types/types';

const ShareModal: React.FC<SessionModal> = ({ closeModal, session  }) => {

  const [activeTab, setActiveTab] = useState('share');

  return (
    <div className='h-36 md:h-44 w-full'>
      <div className='absolute top-4 inline-flex gap-x-1 w-full justify-start items-center z-0'>
        <button onClick={() => setActiveTab('share')} className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-sm transition duration-300">Compartir</button>
        <button onClick={() => setActiveTab('history')} className="bg-pink-700 hover:bg-pinks-800 text-white text-xs font-semibold py-1 px-2 rounded-sm transition duration-300">Historial</button>
      </div>
      <div className="mt-10 h-full w-full">
        <div className={`h-full w-full ${activeTab === 'share' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          <LinkReferedModal closeModal={closeModal} session={session}/>
        </div>
        <div className={`h-full w-full ${activeTab === 'history' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          <HistoryReferedModal closeModal={closeModal} session={session}/>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;