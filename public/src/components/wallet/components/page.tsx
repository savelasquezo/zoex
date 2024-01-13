import React, { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import CircleLoader from 'react-spinners/CircleLoader';

import { getBitcoinPrice } from '@/utils/cryptoApi';

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { FiDollarSign } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { CiBank } from "react-icons/ci";


type WalletModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
};

type WithdrawType = {
  id: string;
  amount: number;
  date: string;
  voucher: string;
  state: boolean;
};

export const fetchWithdrawals = async (accessToken: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/user/fetch-withdrawals/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`,
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

export const fetchRefresh = async (accessToken: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/user/refresh-invoices/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`,
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



const WalletModal: React.FC<WalletModalProps> = ({ closeModal, session  }) => {

  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState('wallet');
  const [activeSubTab, setActiveSubTab] = useState('balance');

  const [errorAdd, setErrorAdd] = useState('');
  const [successAdd, setSuccessAdd] = useState('');
  const [errorWithdraw, setErrorWithdraw] = useState('');
  const [successWithdraw, setSuccessWithdraw] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');

  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawInfo, setWithdrawInfo] = useState('');

  const [invoice, setInvoice] = useState('');
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  const [withdraw, setWithdraw] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [withdrawList, setWithdrawList] = useState<WithdrawType[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const withdrawPerPage = 1;

  const pageCount = Math.ceil(withdrawList.length) / withdrawPerPage;
  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };

  const [formData, setFormData] = useState({paymentAmount: 0,withdrawAmount: ''});
  const {paymentAmount, withdrawAmount } = formData;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const accessToken = session.user.accessToken;
        try {
          const withdrawalData = await fetchWithdrawals(accessToken);
          setWithdrawList(withdrawalData || []);
          
          const bitcoinPrice = await getBitcoinPrice();
          setBitcoinPrice(bitcoinPrice);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchData();
  }, [activeTab, session]);
  

  const displayWithdraw = withdrawList.length > 0
  ? (
    <table className="min-w-full text-center text-sm font-light">
      <thead className="font-medium text-white">
        <tr className="border-b border-slate-900 uppercase text-xs">
          <th scope="col" className=" px-6 py-2">ID</th>
          <th scope="col" className=" px-6 py-2">Volumen</th>
          <th scope="col" className=" px-6 py-2">Fecha</th>
          <th scope="col" className=" px-6 py-2">Voucher</th>
        </tr>
      </thead>
      {withdrawList?.slice(pageNumber * withdrawPerPage, (pageNumber + 1) * withdrawPerPage).map((obj, index) => (
        <tr key={index} className="border-b border-slate-700 uppercase text-xs text-white">
          <td className="whitespace-nowrap px-6 py-2 font-Courier font-semibold">{obj.id}</td>
          <td className="whitespace-nowrap px-6 py-2">{obj.amount}</td>
          <td className="whitespace-nowrap px-6 py-2">{obj.date}</td>
          <td className="whitespace-nowrap px-6 py-2">{obj.voucher}</td>
        </tr>
      ))}
    </table>
  )
  : <p>No hay datos de retiro disponibles.</p>;


  const userBalanceUSD = session?.user?.balance !== undefined
    ? (session?.user?.balance).toFixed(2)
    : undefined;

  const userCreditsUSD = session?.user?.credits !== undefined
    ? (session?.user?.credits).toFixed(2)
    : undefined;

  const userBalanceBTC = bitcoinPrice !== null && userBalanceUSD !== undefined
    ? (parseFloat(userBalanceUSD) / bitcoinPrice).toFixed(6)
    : null;

  const userCreditsBTC = bitcoinPrice !== null && userCreditsUSD !== undefined
    ? (parseFloat(userCreditsUSD) / bitcoinPrice).toFixed(6)
    : null;

  const userUSD = userBalanceUSD !== undefined && userCreditsUSD !== undefined
    ? (parseFloat(userBalanceUSD) + parseFloat(userCreditsUSD)).toFixed(2)
    : null;

  const userBTC = bitcoinPrice !== null && userUSD !== null
    ? (parseFloat(userUSD) / bitcoinPrice).toFixed(6)
    : null;

  const onSubmitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessAdd('');
    setErrorAdd('');

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (typeof paymentAmount !== 'number' || paymentAmount < 10 || paymentAmount > 99999) {
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
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/request-invoice/`, {
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
        setPaymentInfo(paymentMethod);
        setInvoice(data.apiInvoice);
        setInvoiceSuccess(true);
      }
    } catch (error) {
      console.error('RequestInvoice Error:', error);
    }
    
    setLoading(false);
  };


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
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/request-withdraw/`, {
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

  const onRefresh = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const currentTime = new Date().getTime();
    await new Promise(resolve => setTimeout(resolve, 1500));
    fetchRefresh(session?.user?.accessToken)
      .then((data) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        return
    });
  };


  return (
    <div className="h-72">
      <div className='absolute top-4 inline-flex gap-x-1 w-full justify-start items-center z-0'>
        <button onClick={() => setActiveTab('wallet')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'wallet' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Wallet</button>
        <button onClick={() => setActiveTab('history')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'history' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Historial</button>
      </div>
      <hr className='border-slate-700 shadow-inner mt-10'/>
      {showModal && (
        <div className="mt-10 h-full w-full">
          <div className={`h-full w-full ${activeTab === 'wallet' ? 'block' : 'hidden'}`}>
            <div className="flex flex-row items-center gap-x-2 -mt-8 py-2 uppercase">
              <span onClick={() => setActiveSubTab('balance')} className="bg-yellow-600 text-white text-xs rounded-sm px-1 py-0.5 text-md hover:bg-yellow-700 cursor-pointer transition-colors duration-300">Balance</span>
              <span onClick={() => setActiveSubTab('add')} className="bg-green-600 text-white text-xs rounded-sm px-1 py-0.5 text-md hover:bg-green-700 cursor-pointer transition-colors duration-300">Agregar</span>
              <span onClick={() => setActiveSubTab('withdraw')} className="bg-red-600 text-white text-xs rounded-sm px-1 py-0.5 text-md hover:bg-red-700 cursor-pointer transition-colors duration-300">Retirar</span>
            </div>
            <div className={`w-full h-full ${activeSubTab === 'balance' ? 'block' : 'hidden' }`}>
              <div className="flex flex-row bg-gray-900 rounded-md w-full justify-between items-center p-4">
                <div className="relative flex flex-row justify-between w-full">
                  <div className="flex flex-col gap-y-1 leading-3 justify-center h-20">
                    <span className="text-gray-400 my-1 text-xs uppercase">Balance</span>
                    <span className="text-green-400 text-2xl">{session?.user?.balance} - USD</span>
                    <span className="text-yellow-400 text-xs -mt-1">{userBTC} - BTC</span>
                  </div>
                  <div className="absolute right-4 flex items-center h-full">
                      {loading ? (
                      <button type="button" className="bg-blue-500 hover:bg-blue-700 transition-colors duration-300 rounded-full p-0.5 px-2 h-8 text-white"><CircleLoader loading={loading} size={16} color="#1c1d1f" /></button>
                      ) : (
                      <button onClick={onRefresh} className="bg-blue-500 hover:bg-blue-700 transition-colors duration-300 rounded-full p-0.5 px-2 h-8 text-white"><LuRefreshCw /></button>
                      )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col px-4 w-full mt-8 mb-2 gap-y-4">
                <div className="flex flex-row w-full justify-between items-center">
                  <div className="flex flex-row gap-x-2 items-center">
                    <span className="bg-blue-800 text-white rounded-md py-3 px-4"><FaWallet /></span>
                    <div className="flex flex-col">
                      <p className="text-gray-300 text-sm">Saldo</p>
                      <p className="text-gray-400 text-xs">Disponibles</p>
                    </div>
                  </div>
                  <div className="flex flex-col leading-3 text-right">
                    <span className="text-gray-300 text-lg">{userBalanceUSD} USD</span>
                    <span className="text-gray-400 text-xs -mt-1">{userBalanceBTC} BTC</span>
                  </div>
                </div>
                <div className="flex flex-row w-full justify-between">
                  <div className="flex flex-row gap-x-2 items-center">
                    <span className="bg-green-600 text-white rounded-md py-3 px-4"><GiTwoCoins /></span>
                    <div className="flex flex-col">
                      <p className="text-gray-300 text-sm">Creditos</p>
                      <p className="text-gray-400 text-xs">Promocional (No-Retirables)</p>
                    </div>
                  </div>
                  <div className="flex flex-col leading-3 text-right">
                    <span className="text-gray-300 text-lg">{userCreditsUSD} USD</span>
                    <span className="text-gray-400 text-xs -mt-1">{userCreditsBTC} BTC</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`w-full h-full relative ${activeSubTab === 'add' ? 'block' : 'hidden' }`}>
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
                  <div className="absolute right-4 flex items-center h-full">
                    {loading ? (
                    <button type="button" className="bg-green-500 hover:bg-green-700 transition-colors duration-300 rounded-full p-0.5 px-2 h-8 text-white"><CircleLoader loading={loading} size={16} color="#1c1d1f" /></button>
                    ) : (
                    <button onClick={onSubmitInvoice} className={`${paymentInfo === '' ? 'block' : 'hidden' } bg-green-500 hover:bg-green-700 transition-colors duration-300 rounded-full p-0.5 px-2 h-8 text-white`}><MdNavigateNext /></button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full h-full mt-8 mb-2 gap-y-4">
                <div className={`w-full h-full px-4 ${paymentInfo === '' ? 'block' : 'hidden' }`}>
                  <p className="text-center uppercase text-xs font-semibold text-gray-400 mb-4">Selecciona Metodo de pago</p>
                  <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    <span onClick={() => {if (paymentMethod === 'crypto') {setPaymentMethod('');} else {setPaymentMethod('crypto');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/bitcoin.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300  ${paymentMethod === 'crypto' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (paymentMethod === 'bank') {setPaymentMethod('');} else {setPaymentMethod('bank');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/bank.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'bank' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (paymentMethod === 'paypal') {setPaymentMethod('');} else {setPaymentMethod('paypal');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/paypal.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'paypal' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (paymentMethod === 'nequi') {setPaymentMethod('');} else {setPaymentMethod('nequi');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/nequi.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'nequi' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (paymentMethod === 'daviplata') {setPaymentMethod('');} else {setPaymentMethod('daviplata');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/daviplata.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${paymentMethod === 'daviplata' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                  </div>
                </div>
                <div className={`w-full h-full ${paymentInfo !== '' ? 'block' : 'hidden' }`}>
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className={`flex flex-col leading-none ${paymentInfo === 'crypto' ? 'block' : 'hidden' }`}>
                      <Link href={`https://confirmo.net/public/invoice/${invoice}`} target="_blank" rel="noopener noreferrer">
                        <Image unoptimized width={192} height={128} src={"/assets/image/pyment-crypto.webp"} className={`rounded-lg shadow-inherit h-10 w-22 object-fit hover:shadow-lg transition duration-300`} alt="" />
                      </Link>
                    </div>
                    <div className={`flex flex-col leading-none ${paymentInfo === 'bank' ? 'block' : 'hidden' }`}>
                      <div className="flex flex-row gap-x-2 justify-start items-center">
                        <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
                          <span className="text-4xl text-gray-400"><CiBank /></span>
                          <div className="flex flex-col ml-2">
                            <p>Bancolombia -Ahorros</p>
                            <p>4545745-5353</p>
                          </div>
                        </div>
                        <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
                          <span className="text-4xl text-gray-400"><CiBank /></span>
                          <div className="flex flex-col ml-2">
                            <p>Davivienda -Ahorros</p>
                            <p>4545745-5353</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`flex flex-col leading-none ${paymentInfo === 'paypal' ? 'block' : 'hidden' }`}>
                      <Link href={`https://www.paypal.com/`} target="_blank" rel="noopener noreferrer">
                        <Image unoptimized width={192} height={128} src={"/assets/image/pyment-paypal.webp"} className={`rounded-lg shadow-inherit h-10 w-22 object-fit hover:shadow-lg transition duration-300`} alt="" />
                      </Link>
                    </div>
                    <div className={`flex flex-col leading-none ${paymentInfo === 'nequi' ? 'block' : 'hidden' }`}>
                      <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
                        <span className="text-4xl text-gray-400"><CiBank /></span>
                        <div className="flex flex-col ml-2">
                          <p>Nequi</p>
                          <p>4545745-5353</p>
                        </div>
                      </div>
                    </div>
                    <div className={`flex flex-col leading-none ${paymentInfo === 'daviplata' ? 'block' : 'hidden' }`}>
                      <div className="text-xs text-white flex flex-row items-center bg-gray-900 rounded-sm py-2 px-2 h-10">
                        <span className="text-4xl text-gray-400"><CiBank /></span>
                        <div className="flex flex-col ml-2">
                          <p>Daviplata</p>
                          <p>4545745-5353</p>
                        </div>
                      </div>
                    </div>
                    <span className="bg-gray-900 rounded-sm py-2 px-4 text-white h-10 -mt-1">{invoice}</span>
                  </div>
                  <p className="absolute bottom-8 w-full text-xs text-justify text-gray-400">
                    Incluye en la descripción el código de compra, El tiempo de confirmación es de 24 a 36 horas<br /> 
                    ¿Necesitas Ayuda? support@zoexwin.com</p>
                </div>
              </div>
            </div>
            <div className={`w-full h-full ${activeSubTab === 'withdraw' ? 'block' : 'hidden' }`}>
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
                    <span onClick={() => {if (withdrawMethod === 'crypto') {setWithdrawMethod('');} else {setWithdrawMethod('crypto');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/bitcoin.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300 ${withdrawMethod === 'crypto' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (withdrawMethod === 'bank') {setWithdrawMethod('');} else {setWithdrawMethod('bank');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/bank.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${withdrawMethod === 'bank' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (withdrawMethod === 'paypal') {setWithdrawMethod('');} else {setWithdrawMethod('paypal');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/paypal.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${withdrawMethod === 'paypal' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (withdrawMethod === 'nequi') {setWithdrawMethod('');} else {setWithdrawMethod('nequi');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/nequi.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${withdrawMethod === 'nequi' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                    <span onClick={() => {if (withdrawMethod === 'daviplata') {setWithdrawMethod('');} else {setWithdrawMethod('daviplata');}}} className=""><Image unoptimized width={405} height={200} src={"/assets/image/daviplata.webp"} className={`rounded-lg shadow-inherit h-12 w-22 object-fit hover:scale-[1.05] transition-transform duration-300" ${withdrawMethod === 'daviplata' ? 'opacity-100' : 'opacity-80'}`} alt="" /></span>
                  </div>
                </div>
                <div className={`w-full h-full ${withdrawInfo !== '' ? 'block' : 'hidden' }`}>
                  <p className="text-gray-400 uppercase text-sm">Codigo: {withdraw}</p>
                  <p className="absolute bottom-8 w-full text-xs text-justify text-gray-400">
                    Los fondos seran transferidos en un periodo de 24 a 36 Horas<br /> 
                    ¿Necesitas Ayuda? support@zoexwin.com</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: activeTab === 'history' ? 'block' : 'none' }} className={`h-full w-full ${activeTab === 'wallet' ? 'hidden' : ''}`}>
            <div className="relative h-full w-full text-gray-500">
              <ul>{displayWithdraw}</ul>
              <ReactPaginate
                previousLabel={<MdNavigateBefore/>}
                nextLabel={<MdNavigateNext/>}
                breakLabel={'...'}

                pageCount={pageCount}
                marginPagesDisplayed={0}
                pageRangeDisplayed={5}
                onPageChange={changePage}
                className={'absolute bottom-5 w-full flex flex-row items-center justify-center gap-x-2'}
                pageClassName={'bg-slate-700 text-slate-700 rounded-full !px-3 !py-0 transition-colors duration-300'}
                activeClassName={'bg-slate-600 text-slate-600 rounded-full !px-3 !py-0 transition-colors duration-300'}

                previousClassName={'absolute left-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}
                nextClassName={'absolute right-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}

              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletModal;
