import React, { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import Image from 'next/image';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import CircleLoader from 'react-spinners/CircleLoader';

import { FiDollarSign } from "react-icons/fi";

interface withdrawModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
}

const WithdrawModal: React.FC<withdrawModalProps> = ({ closeModal, session  }) => {

    const [loading, setLoading] = useState(false);

    const [errorWithdraw, setErrorWithdraw] = useState('');
    const [successWithdraw, setSuccessWithdraw] = useState('');
  
    const [withdrawMethod, setWithdrawMethod] = useState('');
    const [withdrawInfo, setWithdrawInfo] = useState('');
  
    const [withdraw, setWithdraw] = useState('');
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);

    const [formData, setFormData] = useState({withdrawAmount: ''});
    const {withdrawAmount} = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    

    const onSubmitWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessWithdraw('');
        setErrorWithdraw('');
    
        await new Promise(resolve => setTimeout(resolve, 1000));
        const amountPattern = /^[1-9][0-9]+$/;
        if (!amountPattern.test(withdrawAmount) || parseInt(withdrawAmount, 0) >= 99999 || parseInt(withdrawAmount, 0) <= 9) {
          setErrorWithdraw('¡Error - Ingrese un valor Valido entre 10 USD & 99999 USD!');
          setLoading(false);
          return;
        }
    
        if (!withdrawMethod) {
          setErrorWithdraw('¡Error - Seleccione un Metodo de Pago!');
          setLoading(false);
          return;
        }
    
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/request-withdraw/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${session?.user?.accessToken}`,
            },
            body: JSON.stringify({    
              withdrawMethod,
              withdrawAmount,
            }),
          });
          const data = await res.json();
          if (!data.error) {
            setSuccessWithdraw('¡Facturacion Exitosa!');
            setWithdrawInfo(withdrawMethod);
            setWithdraw(data.apiWithdraw);
            setWithdrawSuccess(true);
            if (session && session.user) {
              session.user.balance = data.newBalance;
            }
          }
        } catch (error) {
          console.error('RequestWithdraw Error:', error);
        }
        setLoading(false);
      };
    

    return (
        <div className="relative h-full w-full text-gray-500">
              <div className="flex flex-row bg-gray-900 rounded-md w-full justify-between items-center p-4">
                <div className="relative flex flex-row justify-between w-full">
                  <div className="flex flex-col gap-y-1 leading-3 justify-center h-20">
                    <div className="flex flex-row justify-start items-center gap-x-2">
                      <span className="text-gray-400 my-1 text-xs uppercase">Retirar Fondos</span>
                      { successWithdraw && (<div className="text-lime-400 text-sm">{successWithdraw}</div>)}
                      { errorWithdraw && (<div className="text-red-400 text-sm">{errorWithdraw}</div>)}
                    </div>
                    <div className="relative h-8 w-full min-w-[200px]">
                      <div className="absolute text-gray-500 text-lg top-2/4 left-2 grid h-5 w-5 -translate-y-2/4 items-center"><FiDollarSign/></div>
                      <input className="h-full w-64 indent-4 text-gray-200 rounded-sm border border-gray-800 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
                          type="number"
                          name="withdrawAmount"
                          value={withdrawAmount}
                          onChange={(e) => onChange(e)}
                          min="1"
                          max="9999"
                          pattern="[0-9]*"
                          required
                          readOnly={withdrawSuccess}
                      />
                    </div>
                  </div>
                  <div className="absolute right-4 flex items-center h-full">
                    {loading ? (
                    <button type="button" className="bg-green-500 hover:bg-green-700 transition-colors duration-300 rounded-full p-0.5 px-2 h-8 text-white"><CircleLoader loading={loading} size={16} color="#1c1d1f" /></button>
                    ) : (
                    <button onClick={onSubmitWithdraw} className={`${withdrawInfo === '' ? 'block' : 'hidden' } bg-green-500 hover:bg-green-700 transition-colors duration-300 rounded-full p-0.5 px-2 h-8 text-white`}><MdNavigateNext /></button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full h-full mt-8 mb-2 gap-y-4">
                <div className={`w-full h-full px-4 ${withdrawInfo === '' ? 'block' : 'hidden' }`}>
                  <p className="text-center uppercase text-xs font-semibold text-gray-400 mb-4">Selecciona Metodo de Retiro</p>
                  <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    <span onClick={() => {if (withdrawMethod === 'confirmo') {setWithdrawMethod('');} else {setWithdrawMethod('crypto');}}} className=""><Image width={405} height={200} src={"/assets/image/bitcoin.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300 ${withdrawMethod === 'crypto' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (withdrawMethod === 'bold') {setWithdrawMethod('');} else {setWithdrawMethod('bank');}}} className=""><Image width={405} height={200} src={"/assets/image/bold.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${withdrawMethod === 'bank' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                  </div>
                </div>
                <div className={`w-full h-full ${withdrawInfo !== '' ? 'block' : 'hidden' }`}>
                  <p className="text-gray-400 uppercase text-sm">Codigo: {withdraw}</p>
                  <p className="absolute bottom-8 w-full text-xs text-justify text-gray-400">
                    Los fondos seran transferidos en un periodo de 24 a 36 Horas<br /> 
                    ¿Necesitas Ayuda? support@zoexbet.com</p>
                </div>
              </div>
        </div>
    );
};

export default WithdrawModal;
