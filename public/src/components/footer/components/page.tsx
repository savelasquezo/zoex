import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { NextResponse } from 'next/server';

import ProfileModal from '@/components/profile/index';
import TicketsModal from '@/components/tickets/index';
import AccountWallet from '@/components/wallet/index';
import ShareModal from '@/components/share/index';
import SupportModal from '@/components/support/index';
import Tooltip from '@/utils/tooltip';

import { SessionInfo } from '@/lib/types/types';

import {FaUser} from 'react-icons/fa';
import {HiShare} from 'react-icons/hi';
import {IoMdHelp} from 'react-icons/io';
import {IoTicket} from 'react-icons/io5';
import {AiOutlineClose} from 'react-icons/ai';

type InfoType = {
  phone: string;
  facebook: string;
  twitter: string;
  instagram: string;
};

export const fetchInfo = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/core/fetch-info/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Server responded with an error' });
    }

    const data = await res.json();
    localStorage.setItem('infoData', JSON.stringify(data));
    return data;
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' });
  }
}

const Footer: React.FC<SessionInfo> = ({ session  }) => {

    const [showModal, setShowModal] = useState(false);
    const [closingModal, setClosingModal] = useState(false);

    const [activeTab, setActiveTab] = useState('');

    const openModal = (tab: string) => {
        setShowModal(true);
        setActiveTab(tab);
    };

    const closeModal = () => {
        setClosingModal(true);
        setTimeout(() => {
        setShowModal(false);
        setClosingModal(false);
        }, 500);
    };

    useEffect(() => {
      fetchInfo()
        .then((data: InfoType) => {
          localStorage.setItem('infoData', JSON.stringify(data));
        })
        .catch((error) => {
          console.error('¡Server responded with an error! ', error);
        });
    }, []);

    return (
      <main className="fixed bottom-0 w-full h-14 bg-gray-900 z-10">
        <div className="w-full h-full flex flex-row items-center px-4 py-1">
            <span onClick={() => openModal('history')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<FaUser />} Text="Perfil"/></span>
            <span onClick={() => openModal('tickets')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<IoTicket />} Text="Tickets"/></span>
            <div className="w-1/5 relative flex justify-center cursor-pointer">
                <button onClick={() => openModal('wallet')} className="absolute -top-12 rounded-full px-2 py-1 bg-white h-16 w-16 border-4 border-gray-900 bg-gradient-to-b from-yellow-400 to-red-800">
                    <Image width={150} height={150} src={"/assets/animations/animatedWallet.gif"} priority={false} className="scale-150" alt="" />
                </button>
            </div>
            <span onClick={() => openModal('share')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<HiShare />} Text="Compartir"/></span>
            <span onClick={() => openModal('support')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<IoMdHelp />} Text="Soporte"/></span>
        </div>
        {showModal && (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
            <div className={`relative w-4/5 sm:3/5 md:w-2/5 bg-gray-800 rounded-lg p-6 pb-2`}>
              <button onClick={closeModal} className='absolute z-10 top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                <div className={`h-full my-4 ${activeTab === 'history' ? 'block' : 'hidden'}`}>
                  <ProfileModal />
                </div>
                <div className={`h-full my-4 ${activeTab === 'tickets' ? 'block' : 'hidden'}`}>
                  <TicketsModal />
                </div>
                <div className={`h-full my-4 ${activeTab === 'wallet' ? 'block' : 'hidden'}`}>
                  <AccountWallet />
                </div>
                <div className={`h-full my-4 ${activeTab === 'share' ? 'block' : 'hidden'}`}>
                  <ShareModal />
                </div>
                <div className={`h-full my-4 ${activeTab === 'support' ? 'block' : 'hidden'}`}>
                  <SupportModal />
                </div>
            </div>
          </div>
        )}
      </main>
    );
};

export default Footer;
