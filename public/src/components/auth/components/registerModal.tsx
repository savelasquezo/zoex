import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { NextResponse } from 'next/server';
import { validatePassword } from "@/utils/passwordValidation";
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import CircleLoader from 'react-spinners/CircleLoader';
import { ModalFunction } from '@/lib/types/types';

import {AiOutlineUser} from 'react-icons/ai'
import {CiMail} from 'react-icons/ci'
import {FiLock} from 'react-icons/fi'
import { IoArrowBackCircle } from "react-icons/io5";

import { InfoType } from '@/lib/types/types';
  
const RegisterModal: React.FC<ModalFunction> = ({ closeModal }) => {
    const searchParams = useSearchParams();
    const [infoRefered, setInfoRefered] = useState(false);
    const [info, setInfo] = useState<InfoType | undefined>(undefined);
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [phone, setPhone] = useState<string | undefined>('');

    const [activeTab, setActiveTab] = useState('registerModal');

    const handlePhoneChange = (value: string, country: string, e: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
      setPhone(formattedValue);
    };
    
    const [formData, setFormData] = useState({
        phone: '',
        username: '',
        email: '',
        password: '',
      });

    const {username, email, password } = formData;

    const [agreed, setAgreed] = useState(false);
    const toggleAgreed = () => {
        if (agreed) {
          setAgreed(false);
        } else {
          setAgreed(true);
        }
    };

    useEffect(() => {
      if (searchParams.get('uuid')) {
        setInfoRefered(true);
      }
      const storedInfo = localStorage.getItem('infoData');
      if (storedInfo) {
        try {
          const parsedInfo = JSON.parse(storedInfo);
          setInfo(parsedInfo);
        } catch (error) {
          NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
        }
      }

    }, [searchParams]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const onSubmit = async (e: React.FormEvent) => {
        const re_password = password;
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
    
        await new Promise(resolve => setTimeout(resolve, 1000));
        //const usernamePattern = /^[a-zA-Z0-9]+$/;
        //if (!usernamePattern.test(username)) {
        //  setError('¡Email invalido! Unicamente Alfanuméricos');
        //  setLoading(false);
        //  return;
        //} else {
        //  setError('');
        //}

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
          setError('¡Email invalido! example@domain.com');
          setLoading(false);
          return;
        } else {
          setError('');
        }

        //const passwordValidationResult = validatePassword(password);
        //if (passwordValidationResult) {
        //  setError(passwordValidationResult);
        //  setLoading(false);
        //  return;
        //} else {
        //  setError('');
        //}

        if (!agreed) {
          setError('¡Acepta los Términos del Servicio!');
          setLoading(false);
          return;
        }

        const referred = searchParams.get('uuid') ?? 'N/A';
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone,
              username,
              email,
              referred,
              password,
              re_password
            }),
          });
      
          const data = await res.json();
          if (!res.ok) {
            setLoading(false);
            return setError("¡Email no encontrado! Intentalo nuevamente.");
          }
          setRegistrationSuccess(true);
          setSuccess("¡Enviamos un correo electrónico de verificación.! ");
          NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });

        } catch (error) {
          return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });

        } finally  {
          setLoading(false);
        }
        
    };

    const openModal = (tab: string) => {
      setActiveTab(tab);
    };

    return (
        <div className="">
          <div className={`h-full my-4 ${activeTab === 'registerModal' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'legalModal' ? 'hidden' : ''}`}>
            <form method="POST" onSubmit={onSubmit} className="relative flex flex-col gap-y-4 p-2">
                <div className="bg-gray-800 text-gray-400 border border-gray-700 px-2 rounded-lg">
                  <PhoneInput
                    country="co"
                    value={phone}
                    onChange={handlePhoneChange}
                    preferredCountries={['co', 'us']}
                    buttonClass={'!bg-transparent !border-0'}
                    inputProps={{ className: 'h-10 md:h-12 w-full bg-gray-800 indent-10 text-gray-400 outline-none' }}
                    disabled={registrationSuccess}
                    prefix="+"
                    specialLabel={''}
                    alwaysDefaultMask={true}
                    defaultMask={'...-...-..-..'}
                  />
                </div>
                <div className="relative h-8 md:h-10 w-full flex items-center min-w-[200px]">
                    <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><AiOutlineUser/></div>
                    <input className="h-8 md:h-12 w-full indent-8 text-gray-200 rounded-lg border border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Usuario"
                        readOnly={registrationSuccess}
                    />
                </div>
                <div className="relative h-8 md:h-10 w-full flex items-center min-w-[200px]">
                    <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><CiMail/></div>
                    <input className="h-8 md:h-12 w-full indent-8 text-gray-200 rounded-lg border border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Email"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                        readOnly={registrationSuccess}
                    />
                </div>
                 <div className="relative h-8 md:h-10 w-full flex items-center min-w-[200px]">
                    <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><FiLock/></div>
                    <input className="h-8 md:h-12 w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline-0 ring-0 focus:!ring-0 transition-all focus:outline-0 disabled:border-0"
                        type="password" 
                        name="password"
                        value={password}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Contraseña"
                        readOnly={registrationSuccess}
                    />
                </div>
                <div className="inline-flex items-start gap-x-2 my-1 md:my-2">
                    <input type="checkbox" id="checkbox"onChange={toggleAgreed} readOnly={registrationSuccess}/>
                    <p onClick={() => openModal('legalModal')} className="text-[0.55rem] md:text-[0.6rem] text-gray-300">Confirmo que tengo 18 años y que he leído y aceptado todos los<span className="text-[0.55rem] md:text-[0.6rem] text-green-400 hover:text-blue-400 transition-colors duration-300"> Términos del servicio y Tratamiento de datos.</span></p>
                </div>
                {registrationSuccess ? (
                  <p onClick={closeModal} className="h-10 bg-green-500 text-white font-semibold rounded-md py-2 px-4 w-full text-sm text-center uppercase">
                    Verificar email
                  </p>
                ) : (
                  loading ? (
                    <button type="button" className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center flex items-center justify-center">
                      <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                    </button>
                  ) : (
                    <button type="submit" className="relative h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center">
                      <p>Inscribirse</p>
                      {infoRefered ? (
                        <Image width={1200} height={800} src={"/assets/image/bonus.webp"} alt="" className="absolute top-2/4 right-2 grid w-20 -translate-y-2/4 object-contain"/>
                      ) : ( null)}            
                    </button>
                  )
                )}
                
            </form>
            { success && (<div className="text-lime-400 text-xs md:text-sm mt-0 md:mt-2">{success}</div>)}
            { error && (<div className="text-red-400 text-xs md:text-sm mt-0 md:mt-2">{error}</div>)}
            { !error && !success && (<div className="text-gray-400 text-xs mt-0 md:mt-2 h-6">¿Necesitas ayuda? support@zoexbet.com</div>)}
        </div>
        <div className={`h-[40vh] lg:h-[64vh] w-full overflow-scroll overflow-x-hidden mb-4 ${activeTab === 'legalModal' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'registerModal' ? 'hidden' : ''}`}>
          {info && (<div className="text-xs text-gray-500 pr-4" dangerouslySetInnerHTML={{ __html: info.terms }} />)}
          <button onClick={() => openModal('registerModal')} className="absolute bottom-6 right-8 text-4xl text-gray-400 hover:text-gray-300 transition-colors duration-300"><IoArrowBackCircle/></button>
        </div>
      </div>
    );
};

export default RegisterModal