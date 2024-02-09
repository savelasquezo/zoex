import React, { useState } from "react";

import DashboardModal from "@/components/wallet/components/dashboardModal";
import InvoiceModal from "@/components/wallet/components/invoiceModal";
import WithdrawModal from "@/components/wallet/components/withdrawModal";
import ListHistoryWalletModal from "@/components/wallet/components/listHistoryModal";

import { SessionModal } from '@/lib/types/types';


const WalletModal: React.FC<SessionModal> = ({ closeModal, session  }) => {

  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState('wallet');
  const [activeSubTab, setActiveSubTab] = useState('dashboard');

  return (
    <div className="h-72">
      <div className='absolute top-4 inline-flex gap-x-1 w-full justify-start items-center z-0'>
        <button onClick={() => setActiveTab('wallet')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'wallet' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Wallet</button>
        <button onClick={() => setActiveTab('history')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'history' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Historial</button>
      </div>
      <hr className='border-slate-700 shadow-inner mt-10'/>
      {showModal && (
        <div className="mt-10 h-full w-full">
          <div className={`h-full w-full ${activeTab === 'wallet' ? 'block' : 'hidden'}`}>
            <div className="flex flex-row items-center gap-x-2 -mt-8 py-2 uppercase">
              <span onClick={() => setActiveSubTab('dashboard')} className="bg-yellow-600 text-white text-xs rounded-sm px-1 py-0.5 text-md hover:bg-yellow-700 cursor-pointer transition-colors duration-300">Balance</span>
              <span onClick={() => setActiveSubTab('add')} className="bg-green-600 text-white text-xs rounded-sm px-1 py-0.5 text-md hover:bg-green-700 cursor-pointer transition-colors duration-300">Agregar</span>
              <span onClick={() => setActiveSubTab('withdraw')} className="bg-red-600 text-white text-xs rounded-sm px-1 py-0.5 text-md hover:bg-red-700 cursor-pointer transition-colors duration-300">Retirar</span>
            </div>
            <div className={`w-full h-full ${activeSubTab === 'dashboard' ? 'block' : 'hidden' }`}>
              <DashboardModal closeModal={closeModal} session={session}/>
            </div>
            <div className={`w-full h-full ${activeSubTab === 'add' ? 'block' : 'hidden' }`}>
              <InvoiceModal closeModal={closeModal} session={session}/>
            </div>
            <div className={`w-full h-full ${activeSubTab === 'withdraw' ? 'block' : 'hidden' }`}>
              <WithdrawModal closeModal={closeModal} session={session}/>
            </div>
          </div>
          <div style={{ display: activeTab === 'history' ? 'block' : 'none' }} className={`h-full w-full ${activeTab === 'wallet' ? 'hidden' : ''}`}>
            <ListHistoryWalletModal closeModal={closeModal} session={session}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletModal;
