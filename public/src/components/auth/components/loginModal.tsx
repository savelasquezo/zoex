import React, { useState } from "react";
import { getSession, signIn } from 'next-auth/react';
import CircleLoader from 'react-spinners/CircleLoader';
import { ModalFunction } from '@/lib/types/types';

import {CiMail} from 'react-icons/ci'
import {FiLock} from 'react-icons/fi'


const LoginModal: React.FC<ModalFunction> = ({ closeModal }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password,
        });
    
        const session = await getSession();
        if (!res?.error && session) {
          setLoading(false);
          closeModal()
        } else {
          setError("Email/Contraseña Invalidos! ");
          setLoading(false);
        }
    };

    return (
        <div>
            <form method="POST" onSubmit={onSubmit} className="flex flex-col gap-y-4 p-2">
                <div className="relative h-12 w-full min-w-[200px]">
                    <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><CiMail/></div>
                    <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0"
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Email"
                    />
                </div>
                <div className="relative h-12 w-full min-w-[200px]">
                    <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><FiLock/></div>
                    <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Contraseña"
                    />
                </div>
                {loading ? (
                    <button type="button" className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center flex items-center justify-center">
                      <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                    </button>
                  ) : (
                    <button type="submit" className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center">Ingresar</button>
                )}
            </form>
            { error && (<div className="text-red-400 text-sm mt-2">{error}</div>)}
            { !error && (<div className="text-gray-400 text-xs mt-2 h-6">¿Necesitas ayuda? support@zoexbet.com</div>)}
        </div>
    );
};

export default LoginModal