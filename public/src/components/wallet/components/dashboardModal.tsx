import React, { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';

import CircleLoader from 'react-spinners/CircleLoader';

import { FaWallet } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { LuRefreshCw } from "react-icons/lu";

import { getBitcoinPrice } from '@/utils/cryptoApi';

interface DashboardModalProps {
  closeModal: () => void;
  session: Session | null | undefined;
}

export const fetchRefresh = async (accessToken: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/refresh-invoices/`,
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

const DashboardModal: React.FC<DashboardModalProps> = ({ closeModal, session  }) => {

  const [loading, setLoading] = useState(false);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);

  const [activeTab, setActiveTab] = useState('wallet');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bitcoinPrice = await getBitcoinPrice();
        setBitcoinPrice(bitcoinPrice);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [activeTab]);

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

  return (
    <div className="relative h-full w-full text-gray-500">
      <div className="flex flex-row bg-gray-900 rounded-md w-full justify-between items-center p-4">
        <div className="relative flex flex-row justify-between w-full">
          <div className="flex flex-col gap-y-1 leading-3 justify-center h-20">
            <span className="text-gray-400 my-1 text-xs uppercase">Balance</span>
            <span className="text-green-400 text-2xl">{session?.user?.balance} - USD</span>
            <span className="text-yellow-400 text-xs -mt-1">{userBTC} - BTC</span>
          </div>
          <div className="absolute right-4 flex items-center h-full top-auto">
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
            <div className="flex flex-col items-start justify-center">
              <p className="text-gray-300 text-sm">Saldo</p>
              <p className="text-gray-400 text-[0.6rem] hidden md:block lg:text-xs">Disponibles</p>
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
            <div className="flex flex-col items-start justify-center">
              <p className="text-gray-300 text-sm">Creditos</p>
              <p className="text-gray-400 text-[0.6rem] hidden md:block lg:text-xs">Promocional (No-Retirables)</p>
            </div>
          </div>
          <div className="flex flex-col leading-3 text-right">
            <span className="text-gray-300 text-lg">{userCreditsUSD} USD</span>
            <span className="text-gray-400 text-xs -mt-1">{userCreditsBTC} BTC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal