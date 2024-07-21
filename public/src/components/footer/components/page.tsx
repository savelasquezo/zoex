import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { NextResponse } from 'next/server';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { SessionInfo } from '@/lib/types/types';

import ProfileModal from '@/components/profile/index';
import TicketsModal from '@/components/tickets/index';
import AccountWallet from '@/components/wallet/index';
import ShareModal from '@/components/share/index';
import SupportModal from '@/components/support/index';

import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

import {FaUser} from 'react-icons/fa';
import {HiShare} from 'react-icons/hi';
import {IoMdHelp} from 'react-icons/io';
import {IoTicket} from 'react-icons/io5';
import {AiOutlineClose} from 'react-icons/ai';

const Footer: React.FC<SessionInfo> = ({ session  }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
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
        if (searchParams.get('profile')) {
          router.push('/');
        }
        }, 500);
    };

    useEffect(() => {
      if (searchParams.get('profile')) {
        if (session?.user) {
          setShowModal(true);
          setActiveTab("profile");
        }
      }
    }, [searchParams]);

    return (
      <main className="fixed bottom-0 w-full h-14 bg-gray-900 z-10">
        <div className="w-full h-full flex flex-row items-center px-4 py-1">
            <span onClick={() => openModal('profile')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer">
              <p className="text-lg text-center bg-gradient-to-b from-yellow-400 to-red-800 rounded-full p-2">
                <FaUser data-tooltip-id="FaUser" data-tooltip-content="PERFIL" data-tooltip-place="top" /><Tooltip id="FaUser"/>
              </p>
            </span>
            <span onClick={() => openModal('tickets')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer">
              <p className="text-lg text-center bg-gradient-to-b from-yellow-400 to-red-800 rounded-full p-2">
                <IoTicket data-tooltip-id="IoTicket" data-tooltip-content="TICKETS" data-tooltip-place="top" /><Tooltip id="IoTicket"/>
              </p>
            </span>
            <div className="w-1/5 relative flex justify-center cursor-pointer">
                <button onClick={() => openModal('wallet')} className="absolute -top-12 rounded-full px-2 py-1 bg-white h-16 w-16 border-4 border-gray-900 bg-gradient-to-b from-yellow-400 to-red-800">
                    <Image width={150} height={150} src={"/assets/animations/animatedWallet.gif"} priority={false} className="scale-150" alt="" />
                </button>
            </div>
            <span onClick={() => openModal('share')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer">
              <p className="text-lg text-center bg-gradient-to-b from-yellow-400 to-red-800 rounded-full p-2">
                <HiShare data-tooltip-id="HiShare" data-tooltip-content="COMPARTIR" data-tooltip-place="top" /><Tooltip id="HiShare"/>
              </p>
            </span>
            <span onClick={() => openModal('support')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer">
              <p className="text-lg text-center bg-gradient-to-b from-yellow-400 to-red-800 rounded-full p-2">
                <IoMdHelp data-tooltip-id="IoMdHelp" data-tooltip-content="CONTACTO" data-tooltip-place="top" /><Tooltip id="IoMdHelp"/>
              </p>
            </span>
        </div>
        {showModal && (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
            <div className={`relative w-11/12 sm:w-3/5 md:w-3/5 lg:w-2/5 max-w-[40rem] bg-gray-800 rounded-lg p-6 lg:pb-2`}>
              <button onClick={closeModal} className='absolute z-10 top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                <div className={`h-full my-4 ${activeTab === 'profile' ? 'block' : 'hidden'}`}>
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
