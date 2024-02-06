import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';

import BeatLoader from 'react-spinners/BeatLoader';
import { FiDollarSign } from "react-icons/fi";

import BoldButton from '@/utils/BoldButton';

interface InvoiceModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ closeModal, session  }) => {

  const orderId = "ABCD2000";
  const amount = "20000";
  const integritySignature = "a96ac58813e71b0b5232243883851fe19c3dae3269c68ac4fb17ba2352b8084e";


  const [loading, setLoading] = useState(false);
  const [errorAdd, setErrorAdd] = useState('');
  const [successAdd, setSuccessAdd] = useState('');

  const [invoice, setInvoice] = useState('');
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(false);

  const [formData, setFormData] = useState({paymentAmount: ''});
  const {paymentAmount} = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });


  const onSubmit = async (e: React.FormEvent, paymentMethod: string) => {
    e.preventDefault();
    setLoading(true);
    setSuccessAdd('');
    setErrorAdd('');

    await new Promise(resolve => setTimeout(resolve, 1500));
    const amountPattern = /^[1-9][0-9]+$/;
    if (!amountPattern.test(paymentAmount) || parseInt(paymentAmount, 0) >= 99999 || parseInt(paymentAmount, 0) <= 9) {
      setErrorAdd('¡Error - Ingrese un valor Valido entre 10 USD & 99999 USD!');
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setErrorAdd('¡Error - Seleccione un Metodo de Pago!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/request-invoice/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({    
          paymentMethod,
          paymentAmount,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setSuccessAdd('¡Facturacion Exitosa!');
        setPaymentInfo(true);
        setPaymentMethod(paymentMethod)
        setInvoice(data.apiInvoice);
        setInvoiceSuccess(true);
      }
    } catch (error) {
      console.error('RequestInvoice Error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="h-full w-full text-gray-500">
      <div className="flex flex-row bg-gray-900 rounded-md w-full justify-between items-center p-4">
        <div className="relative flex flex-row justify-between w-full">
          <div className="flex flex-col gap-y-1 leading-3 justify-center h-20">
            <div className="flex flex-row justify-start items-center gap-x-2">
              <span className="text-gray-400 my-1 text-xs uppercase">Agregar Fondos</span>
              { successAdd && (<div className="text-lime-400 text-sm">{successAdd}</div>)}
              { errorAdd && (<div className="text-red-400 text-sm">{errorAdd}</div>)}
            </div>
            <div className="relative h-8 w-full min-w-[200px]">
              <div className="absolute text-gray-500 text-lg top-2/4 left-2 grid h-5 w-5 -translate-y-2/4 items-center"><FiDollarSign/></div>
              <input className="h-full w-64 indent-4 text-gray-200 rounded-sm border border-gray-800 bg-transparent px-3 py-2 !pr-9 text-sm outline outline-0 transition-all focus:outline-0 disabled:border-0"
                  type="number"
                  name="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => onChange(e)}
                  min="1"
                  max="9999"
                  pattern="[0-9]*"
                  required
                  readOnly={invoiceSuccess}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center mt-8 mb-2 gap-y-4">
        {!paymentInfo ? (
          loading ? (
            <div className='w-full h-full text-center'>
              <BeatLoader color="#F87171" loading margin={20} size={30} speedMultiplier={0.5}/>
            </div>
            ) : (
            <div className="w-full flex flex-col gap-x-2">
              <button onClick={(e) => onSubmit(e, "crypto")} className=""><Image width={405} height={200} src={"/assets/image/crypto.webp"} className="object-fit w-28 h-12 shadow-inner" alt="" /></button>
              {/*<button onClick={(e) => onSubmit(e, "bold")} className=""><Image width={405} height={200} src={"/assets/image/bold.webp"} className="object-fit h-12 shadow-current" alt="" /></button>*/}
              <BoldButton orderId={orderId} amount={amount} integritySignature={integritySignature}/>
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center px-4">
            <div className="flex flex-row items-center justify-between w-full">
              <div className={`flex flex-col leading-none ${paymentMethod === 'crypto' ? 'block' : 'hidden' }`}>
                <Link href={`https://confirmo.net/public/invoice/${invoice}`} target="_blank" rel="noopener noreferrer">
                  <Image width={192} height={128} src={"/assets/image/crypto.webp"} className="object-fit h-12 shadow-inner" alt="" />
                </Link>
              </div>
              <div className={`flex flex-col leading-none ${paymentMethod === 'bold' ? 'block' : 'hidden' }`}>
                <Link href={`https://confirmo.net/public/invoice/${invoice}`} target="_blank" rel="noopener noreferrer">
                  <Image width={192} height={128} src={"/assets/image/bold.webp"} className={`rounded-lg shadow-inherit h-10 w-22 object-fit hover:shadow-lg transition duration-300`} alt="" />
                </Link>
              </div>
              <span className="bg-gray-900 rounded-sm py-2 px-4 text-white h-10 -mt-1">{invoice}</span>
            </div>
            <p className="absolute bottom-8 w-full text-xs text-justify text-gray-400">
              Incluye en la descripción el código de compra, El tiempo de confirmación es de 24 a 36 horas<br /> 
              ¿Necesitas Ayuda? support@zoexwin.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceModal;
