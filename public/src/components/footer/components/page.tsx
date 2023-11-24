import React, {useState} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import { Session } from 'next-auth';

import {FaUser} from 'react-icons/fa';
import {HiShare} from 'react-icons/hi'
import {IoMdHelp} from 'react-icons/io'
import {IoTicket} from 'react-icons/io5'
import {AiOutlineClose} from 'react-icons/ai'

import ProfileModal from "./profileModal";
import TicketsModal from "./ticketsModal";
import WalletModal from "./walletModal";
import ShareModal from "./shareModal";
import SupportModal from "./supportModal";

import Tooltip from './tooltip';

type FooterProps = {session: Session | null | undefined;};

const Footer: React.FC<FooterProps> = ({ session  }) => {
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
        }, 500);
    };

    return (
        <main className="fixed bottom-0 w-full h-14 bg-gray-900 z-10">
            <div className="w-full h-full flex flex-row items-center px-4 py-1">
                <span onClick={() => openModal('history')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<FaUser />} Text="Perfil"/></span>
                <span onClick={() => openModal('tickets')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<IoTicket />} Text="Tickets"/></span>
                <div className="w-1/5 relative flex justify-center cursor-pointer">
                    <button className="absolute -top-12 rounded-full px-2 py-1 bg-white h-16 w-16 border-4 border-gray-900 bg-gradient-to-b from-yellow-400 to-red-800">
                        <Image width={150} height={150} src={"/assets/animations/animatedWallet.gif"} className="scale-150" alt="" />
                    </button>
                </div>
                <span onClick={() => openModal('share')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<HiShare />} Text="Compartir"/></span>
                <span onClick={() => openModal('support')} className="w-1/5 group relative flex flex-col items-center justify-center text-white cursor-pointer"><Tooltip Icon={<IoMdHelp />} Text="Soporte"/></span>
            </div>
            {showModal && (
            <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
                <div className="relative w-1/2 bg-gray-800 rounded-lg p-6">
                    <button onClick={closeModal} className='absolute z-10 top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                    <div>
                      <div style={{ display: activeTab === 'history' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'history' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab !== 'history' ? 'hidden' : ''}`}>
                        <ProfileModal closeModal={closeModal} session={session}/>
                      </div>
                      <div style={{ display: activeTab === 'tickets' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'tickets' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab !== 'tickets' ? 'hidden' : ''}`}>
                        <TicketsModal closeModal={closeModal} session={session}/>
                      </div>
                      <div style={{ display: activeTab === 'wallet' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'wallet' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab !== 'wallet' ? 'hidden' : ''}`}>
                        <WalletModal closeModal={closeModal} session={session}/>
                      </div>
                      <div style={{ display: activeTab === 'share' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'share' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab !== 'share' ? 'hidden' : ''}`}>
                        <ShareModal closeModal={closeModal} session={session}/>
                      </div>
                      <div style={{ display: activeTab === 'support' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'support' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab !== 'support' ? 'hidden' : ''}`}>
                        <SupportModal closeModal={closeModal} session={session}/>
                      </div>
                    </div>
                </div>
              </div>
          )}
        </main>
    );
};

export default Footer;
