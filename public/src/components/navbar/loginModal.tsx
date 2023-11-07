'use client';

import React, { useState } from "react";
import Image from 'next/image';

import { getSession, signIn } from 'next-auth/react';
import CircleLoader from 'react-spinners/CircleLoader';

import 'react-phone-input-2/lib/style.css'

import {AiOutlineUser} from 'react-icons/ai'
import {FiLock} from 'react-icons/fi'


type LoginModalProps = {
    closeModal: () => void;
  };
  
const LoginModal: React.FC<LoginModalProps> = ({ closeModal }) => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        const res = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password,
        });
    
        const session = await getSession();
        if (res !== undefined && !res.error && session) {
          console.error(res);
        } else {
          console.error(res?.error);
        }
        setLoading(false);
        closeModal()
    };
    

    return (
        <div>
            <form onSubmit={onSubmit} method="POST" className="flex flex-col gap-y-4 p-2">
                <div className="relative h-12 w-full min-w-[200px]">
                    <div className="absolute text-gray-500 text-lg top-2/4 left-4 grid h-5 w-5 -translate-y-2/4 items-center"><AiOutlineUser/></div>
                    <input className="h-full w-full indent-8 text-gray-200 rounded-lg border border-gray-700 focus:border-gray-700 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 ring-0 focus:!ring-0 focus:outline-0 disabled:border-0"
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                        placeholder="Usuario"
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
                    <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center flex items-center justify-center">
                      <CircleLoader loading={loading} size={25} color="#1c1d1f" />
                    </button>
                  ) : (
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full text-center">Ingresar</button>
                )}
            </form>
        </div>
    );
};

export default LoginModal