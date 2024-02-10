import React, { useState } from "react";
import Image from 'next/image';
import { NextResponse } from 'next/server';

import CircleLoader from 'react-spinners/CircleLoader';

import { InfoProfileModalProps } from '@/lib/types/types';

import { GrUpdate } from "react-icons/gr";
import { FaPhone } from 'react-icons/fa';
import { MdLocationCity } from "react-icons/md";
import { RiBankCardFill } from "react-icons/ri";
import { BiCheck } from "react-icons/bi";


const InfoProfileModal: React.FC<InfoProfileModalProps & { formData: any }> = ({closeModal, session, toggleSelectFrame, formData, updateFormData}) => {

  const [loading, setLoading] = useState(false);
  const {frame, location, billing } = formData;
  
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const handleFramenClick = () => {
    toggleSelectFrame(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {const { name, value } = e.target; updateFormData({ [name]: value })};
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/update-account-info/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          frame,
          location,
          billing,
        }),
      });

      const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : {};
      if (!data.error) {
        setRegistrationSuccess(true);
        if (session && session.user) {
          session.user.frame = data.frame;
          session.user.location = data.location;
          session.user.billing = data.billing;
        }
      }
    } catch (error) {
      return NextResponse.json({ error: 'There was an error with the network request' });
    }
    setLoading(false);
  };


  return (
    <form method="POST" onSubmit={onSubmit} className="relative w-full h-full flex flex-col gap-2 justify-start items-center px-2 lg:flex-row">
      <div className='flex flex-col items-center justify-center -mt-6'>
        <Image onClick={handleFramenClick} width={480} height={480} src={`/assets/demo/xFrame${session?.user.frame}.webp`} className="h-40 w-auto object-contain rounded-md z-0 cursor-pointer" alt=""/>
        {registrationSuccess ? (
          <p onClick={closeModal} className="w-36 h-6 lg:w-28 flex items-center justify-center bg-green-500 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300 mt-2 lg:-mt-4 z-10">
            <BiCheck/>
          </p>
        ) : (
          loading ? (
            <button className="w-36 h-6 lg:w-28 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300 mt-2 lg:-mt-4 z-10">
              <CircleLoader loading={loading} size={15} color="#1c1d1f" />
            </button>
          ) : (
            <button className="w-36 h-6 lg:w-28 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-2 rounded transition-colors duration-300 mt-2 lg:-mt-4 z-10"><GrUpdate /></button>
          )
        )}
      </div>
      <div className="flex flex-col w-full h-full justify-center items-center mt-4 ml-4 lg:justify-start lg:items-start">
        <div className='flex flex-row items-center justify-between gap-x-1'>
          <p className='text-lg font-Animace text-gray-200 font-semibold uppercase'>{session?.user.username}</p>
          <p className='text-sm text-gray-300 mb-1 ml-2'>- {session?.user.email}</p>
        </div>
        <span className='flex flex-row items-center justify-start gap-x-2 mb-4 text-sm text-gray-300'><FaPhone/> {session?.user.phone}</span>
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full gap-y-0 p-0 m-0">
            <input type="hidden" name="frame" value={frame ?? session?.user.frame} />
            <div className="relative w-full flex items-center min-w-[200px]">
              <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><MdLocationCity/></div>
              <input className="w-full indent-8 text-gray-200 rounded-sm border border-gray-700 border-b-0 bg-transparent px-3 py-3 !pr-9 text-[0.7rem] outline outline-0 transition-all focus:outline-0 disabled:border-0 lg:text-xs"
                  type="text"
                  name="location"
                  value={location}
                  onChange={(e) => onChange(e)}
                  placeholder={session?.user.location ?? "Direccion/Localidad"}
                  readOnly={registrationSuccess}
              />
            </div>
            <div className="relative w-full flex items-center min-w-[200px]">
              <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><RiBankCardFill/></div>
              <input className="w-full indent-8 text-gray-200 rounded-sm border border-gray-700 border-b-1 bg-transparent px-3 py-3 !pr-9 text-[0.7rem] outline outline-0 transition-all focus:outline-0 disabled:border-0 lg:text-xs"
                  type="text"
                  name="billing"
                  value={billing}
                  onChange={(e) => onChange(e)}
                  placeholder={session?.user.billing ?? "Informacion Bancaria (Retiros/Pagos)"}
                  readOnly={registrationSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InfoProfileModal;
