import React, { useState } from "react";
import { Session } from 'next-auth';

import Image from 'next/image';
import { GrUpdate } from "react-icons/gr";

import { FaPhone } from 'react-icons/fa';
import { CiMail } from 'react-icons/ci'
import { MdLocationCity } from "react-icons/md";
import { RiBankCardFill } from "react-icons/ri";

type ProfileModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ closeModal, session  }) => {

  const [formData, setFormData] = useState({
    phone: '',
    username: '',
    email: '',
    password: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(true);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div>
      {session ? (
      <div className="w-full h-96 flex flex-col gap-2 justify-start items-center px-2 lg:h-40 lg:flex-row">
        <div className='flex flex-col items-center justify-center'>
          <Image width={480} height={480} src={"/assets/demo/xFrame.webp"} className="h-40 w-auto object-contain rounded-md z-0" alt=""/>
          <button className="w-36 lg:w-28 flex items-center justify-center bg-pink-700 hover:bg-pink-900 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300 mt-2 lg:-mt-4"><GrUpdate /></button>
        </div>
        <div className="flex flex-col w-full h-full justify-center items-center mt-4 ml-4 lg:justify-start lg:items-start">
          <div className='flex flex-row items-center justify-between gap-x-1'>
            <p className='text-lg font-Animace text-gray-200 font-semibold uppercase'>ROOT</p>
            <p className='text-sm text-gray-300 mb-1 ml-2'>- {session.user.email}</p>
          </div>
          <span className='flex flex-row items-center justify-start gap-x-2 mb-4 text-sm text-gray-300'><FaPhone/> {session.user.phone}</span>
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full gap-y-0 p-0 m-0">
              <div className="relative w-full flex items-center min-w-[200px]">
                <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><MdLocationCity/></div>
                <input className="w-full indent-8 text-gray-200 rounded-sm border border-gray-700 border-b-0 bg-transparent px-3 py-3 !pr-9 text-[0.7rem] outline outline-0 transition-all focus:outline-0 disabled:border-0 lg:text-xs"
                    type="text"
                    name="location"
                    value={session?.user?.location}
                    onChange={(e) => onChange(e)}
                    required
                    placeholder="Direccion/Localidad"
                    readOnly={registrationSuccess}
                />
              </div>
              <div className="relative w-full flex items-center min-w-[200px]">
                <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><RiBankCardFill/></div>
                <input className="w-full indent-8 text-gray-200 rounded-sm border border-gray-700 border-b-1 bg-transparent px-3 py-3 !pr-9 text-[0.7rem] outline outline-0 transition-all focus:outline-0 disabled:border-0 lg:text-xs"
                    type="text"
                    name="bank"
                    value={session?.user?.billing}
                    onChange={(e) => onChange(e)}
                    required
                    placeholder="Informacion Bancaria (Retiros/Pagos)"
                    readOnly={registrationSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      ):null}
  </div>
  );
};

export default ProfileModal;
