import React, { useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

import { validatePassword } from "../../../utils/passwordValidation";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import CircleLoader from 'react-spinners/CircleLoader';

import {AiOutlineUser} from 'react-icons/ai'
import {CiMail} from 'react-icons/ci'
import {FiLock} from 'react-icons/fi'


type RegisterModalProps = {
  closeModal: () => void;
};
  
const RegisterModal: React.FC<RegisterModalProps> = ({ closeModal }) => {
    const searchParams = useSearchParams();
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [phone, setPhone] = useState<string | undefined>();
    
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

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const onSubmit = async (e: React.FormEvent) => {
        const re_password = password;
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
    
        await new Promise(resolve => setTimeout(resolve, 1000));
        const usernamePattern = /^[a-zA-Z0-9]+$/;
        if (!usernamePattern.test(username)) {
          setError('¡Email Invalido! Unicamente Alfanumericos');
          setLoading(false);
          return;
        } else {
          setError('');
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
          setError('¡Email Invalido! example@domain.com');
          setLoading(false);
          return;
        } else {
          setError('');
        }

        const passwordValidationResult = validatePassword(password);
        if (passwordValidationResult) {
          setError(passwordValidationResult);
          setLoading(false);
          return;
        } else {
          setError('');
        }

        if (!agreed) {
          setError(' ¡Acepta los Terminos del Servicio!');
          setLoading(false);
          return;
        }

        const referred = searchParams.get('uuid') ?? 'N/A';
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            username,
            email,
            password,
            re_password,
            referred,
          }),
        });
    
        const data = await res.json();

        if (data.error) {
          setError("¡Email no Encontrado! Intentalo Nuevamente ");
        } else {
          setSuccess("¡Enviamos un Correo Electronio de Verificacion! ");
          setRegistrationSuccess(true);
        }
        setLoading(false);
    };

    return (
        <div>
            <form onSubmit={onSubmit} className="flex flex-col gap-y-4 p-2">
                <div className="bg-gray-800 text-gray-400 border border-gray-700 px-2 rounded-lg ">
                    <PhoneInput 
                        country="co"
                        value={phone} 
                        onChange={setPhone}
                        preferredCountries={['co','us']}
                        buttonClass={'!bg-transparent !border-0'}
                        inputProps={{className: 'bg-gray-800 indent-10 text-gray-400 border-0 focus:ring-0'}}
                        disabled={registrationSuccess}
                    />
                </div>
                <div className="relative h-12 w-full min-w-[200px]">
                    <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><AiOutlineUser/></div>
                    <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Usuario"
                        readOnly={registrationSuccess}
                    />
                </div>
                <div className="relative gap-y-3 rounded-sm shadow-xl h-12 w-full min-w-[200px]">
                    <div className="absolute text-gray-400 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><CiMail/></div>
                    <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
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
                <ul></ul>
                 <div className="relative h-12 w-full min-w-[200px]">
                    <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><FiLock/></div>
                    <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline-0 ring-0 focus:!ring-0 transition-all focus:outline-0 disabled:border-0"
                        type="password" 
                        name="password"
                        value={password}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Contraseña"
                        readOnly={registrationSuccess}
                    />
                </div>
                <div className="inline-flex items-start gap-x-2 my-2">
                    <input className="bg-transparent transition-all appearance-none focus:!appearance-none"
                        type="checkbox"
                        id="show-agreed"
                        onChange={toggleAgreed}
                        readOnly={registrationSuccess}
                    />
                    <p className="text-xs text-gray-300">Confirmo que tengo 18 años y que he leído y aceptado todos los Términos del servicio y Tratamiento de datos</p>
                </div>
                {registrationSuccess ? (
                  <p onClick={closeModal} className="bg-green-500 text-white font-semibold rounded-md py-2 px-4 w-full text-sm text-center uppercase">
                    Verificar email
                  </p>
                ) : (
                  loading ? (
                    <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center flex items-center justify-center">
                      <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                    </button>
                  ) : (
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center">
                      Inscribirse
                    </button>
                  )
                )}
            </form>
            { success && (<div className="text-lime-400 text-sm mt-2">{success}</div>)}
            { error && (<div className="text-red-400 text-sm mt-2">{error}</div>)}
            { !error && !success && (<div className="text-gray-400 text-xs mt-2 h-6">¿Necesitas Ayuda? support@zoexwin.com</div>)}
        </div>
    );
};

export default RegisterModal