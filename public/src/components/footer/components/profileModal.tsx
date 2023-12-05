import React, { useRef } from 'react';
import Image from 'next/image';

import { Session } from 'next-auth';

import {FaUser, FaPhone, FaCopy} from 'react-icons/fa';
import { MdEmail } from "react-icons/md";





type ProfileModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ closeModal, session  }) => {

  const sessionID = `${session?.user?.accessToken || ''}`
  const handleCopyClick = () => {
    navigator.clipboard.writeText(sessionID)
  };

  return (
    <div>
      <div className="flex flex-row gap-x-2 justify-start items-center px-8 h-28">
        <div className='flex items-center justify-center h-full'>
          <span className='text-gray-400 text-6xl'><FaUser /></span>
        </div>
        <div className="flex flex-col w-full">
          <div className='flex flex-row justify-between'>
            <span className="text-gray-200 text-sm inline-flex items-center gap-x-1"><MdEmail/>{session?.user?.email}</span>
            <div className="flex flex-row gap-x-2">
              <span className='text-gray-200 text-xs uppercase'>{session?.user?.uuid}</span> 
              <span onClick={handleCopyClick} className='text-gray-400 cursor-copy'><FaCopy /></span>
            </div>
          </div>
          <p className="text-gray-200 text-sm inline-flex items-center gap-x-1"><FaPhone/> {session?.user?.phone}</p>
        </div>
      </div>
  </div>
  );
};

export default ProfileModal;
