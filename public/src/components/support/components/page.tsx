import React, { useState, useEffect, ChangeEvent } from "react";
import CircleLoader from 'react-spinners/CircleLoader';
import Link from 'next/link';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';

import {AiOutlineWhatsApp, AiOutlineInstagram} from 'react-icons/ai';
import {BiLogoFacebook} from 'react-icons/bi';
import {CiMail} from 'react-icons/ci';
import { MdSubject } from "react-icons/md";

type SupportModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
};

type InfoType = {
  phone: string;
  facebook: string;
  twitter: string;
  instagram: string;
};

export const fetchInfo = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/api/core/fetch-info/`,
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
    return data;
  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' });
  }
}

const SupportModal: React.FC<SupportModalProps> = ({ closeModal, session  }) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<InfoType>();

  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    subject: '',
    message: '',
  });

  const {email, subject,  message } = formData;
  const [agreed, setAgreed] = useState(false);
  const toggleAgreed = () => {
      if (agreed) {
        setAgreed(false);
      } else {
        setAgreed(true);
      }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchInfo()
      .then((data: InfoType) => {
        setInfo(data);
      })
      .catch((error) => {
        console.error('¡Error al obtener Informacion del Usuario! ', error);
      });
  }, []);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/core/send-message/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject,
          message,
        }),
      });

      const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : {};
      if (!data.error) {
        setRegistrationSuccess(true);
      }
    } catch (error) {
      return NextResponse.json({ error: 'There was an error with the network request' });
    }
    setLoading(false);
  };
  
  return (
    <div>
      <div className='absolute top-4 inline-flex gap-x-2 w-full justify-start items-center z-0'>
        <span className="bg-red-700 text-white text-xs uppercase font-semibold py-1 px-2 rounded transition-colors duration-300">Contacto</span>
        <Link href={`https://wa.me/${info?.phone}`} target="_blank" rel="noopener noreferrer">
            <button className='bg-whatsapp-default hover:bg-whatsapp-hover shadow-inner text-gray-50 p-1 rounded-full transition duration-300'><AiOutlineWhatsApp/></button>
        </Link>
        <Link href={`${info?.facebook}`} target="_blank" rel="noopener noreferrer">
            <button className='bg-facebook-default hover:bg-facebook-hover shadow-inner text-gray-50 p-1 rounded-full transition duration-300'><BiLogoFacebook/></button>
        </Link>
        <Link href={`${info?.instagram}`} target="_blank" rel="noopener noreferrer">
            <button className='bg-instagram-default hover:bg-instagram-hover shadow-inner text-gray-50 p-1 rounded-full transition duration-300'><AiOutlineInstagram/></button>
        </Link>
      </div>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-y-4 p-2 mt-10">
        <div className="relative h-12 w-full">
          <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><CiMail/></div>
          <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
              type="text"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
              placeholder="Email"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
              readOnly={registrationSuccess || !!session?.user?.email}     
          />
        </div>
        <div className="relative h-12 w-full min-w-[200px]">
          <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><MdSubject/></div>
          <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
              type="text"
              name="subject"
              value={subject}
              onChange={(e) => onChange(e)}
              required
              placeholder="Asunto"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
              readOnly={registrationSuccess}     
          />
        </div>
        <div className="relative h-32 w-full min-w-[200px]">
          <textarea className="h-full w-full indent-1 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline-0 ring-0 focus:!ring-0 transition-all focus:outline-0 disabled:border-0"
              name="message"
              value={message}
              onChange={(e) => onChange(e)}
              required
              style={{ resize: 'none' }}
              readOnly={registrationSuccess}
          />
        </div>
        <div className="inline-flex items-start gap-x-2 my-2">
          <input className="bg-transparent transition-all appearance-none focus:!appearance-none"
              type="checkbox"
              id="show-agreed"
              onChange={toggleAgreed}
              required
              readOnly={registrationSuccess}
          />
          <p className="text-xs text-gray-300">Confirmo que tengo 18+ años y que he leído y aceptado todos los 
          Términos del servicio y Tratamiento de datos, Acepto la respuesta via email que será emitida en las próximas 24 horas.</p>
        </div>
        {registrationSuccess ? (
          <p onClick={closeModal} className="bg-green-500 text-white font-semibold rounded-md py-2 px-4 w-full text-sm text-center uppercase">
            Enviado
          </p>
        ) : (
          loading ? (
            <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center flex items-center justify-center">
              <CircleLoader loading={loading} size={25} color="#1c1d1f" />
            </button>
          ) : (
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center">
              Enviar
            </button>
          )
        )}
      </form>
  </div>
  );
};

export default SupportModal;
