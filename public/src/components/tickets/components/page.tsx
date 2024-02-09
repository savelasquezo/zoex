import React, { useState } from "react";

import ListTicketsLotteryModal from "@/components/tickets/components/listTicketsLotteryModal";
import ListTicketsGiveawayModal from "@/components/tickets/components/listTicketsGiveawayModal";

import { SessionModal } from '@/lib/types/types';

const TicketsModal: React.FC<SessionModal>  = ({closeModal, session }) => {
  const [activeTab, setActiveTab] = useState('lottery-tickets');
  return (
    <div className="h-72 w-full">
      <div className='absolute top-4 inline-flex gap-x-1 w-full justify-start items-center z-0'>
        <button onClick={() => setActiveTab('lottery-tickets')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'lottery-tickets' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Loteria</button>
        <button onClick={() => setActiveTab('giveaway-tickets')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'giveaway-tickets' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Sorteos</button>
      </div>
      <div className="mt-10 h-full w-full">
        <div className={`h-full w-full ${activeTab === 'lottery-tickets' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
            <ListTicketsLotteryModal closeModal={closeModal} session={session}/>
        </div>
        <div className={`h-full w-full ${activeTab === 'giveaway-tickets' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          <div className="relative h-full w-full text-gray-500">
            <ListTicketsGiveawayModal closeModal={closeModal} session={session}/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TicketsModal;
