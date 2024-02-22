import React, { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import ReactPaginate from 'react-paginate';

import { SessionModal, HistoryDetails } from '@/lib/types/types';

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { GiCheckMark , GiCrossMark } from "react-icons/gi";
import { GoAlertFill } from "react-icons/go";

export const fetchWithdrawals = async (accessToken: any) => {
    try {
        const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/fetch-withdrawals/`,
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
            return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    }
}

export const fetchInvoices = async (accessToken: any) => {
    try {
        const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/fetch-invoices/`,
        {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`,
            },
        },
        );
        if (res.ok) {
            const data = await res.json();
            return data;
        }
        } catch (error) {
            NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    }
}


const ListHistoryWalletModal: React.FC<SessionModal> = ({ closeModal, session  }) => {

    const [historyList, setHistoryList] = useState<HistoryDetails[]>([]);
    const [pageNumber, setPageNumber] = useState(0);
    const withdrawPerPage = 5;

    const pageCount = Math.ceil(historyList.length/ withdrawPerPage);
    const changePage = ({ selected }: { selected: number }) => {
      setPageNumber(selected);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const accessToken = session.user.accessToken;
                try {
                    const withdrawalData = await fetchWithdrawals(accessToken);
                    const invoiceData = await fetchInvoices(accessToken);

                    const combinedList = withdrawalData.concat(invoiceData);
                    combinedList.sort((a: any, b: any) => {
                        return b.id - a.id;
                    });
    
                    setHistoryList(combinedList);
                } catch (error) {
                    NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
                }
            }
        };
    
        fetchData();
    }, [session]);

    return (
        <div className="relative h-full w-full text-gray-500">
            {historyList.length > 0 ? (
                <div className="relative h-full w-full text-gray-500">
                    <table className="min-w-full text-center text-sm font-light">
                        <thead className="font-medium text-white">
                            <tr className="border-b border-slate-900 uppercase text-xs">
                                <th scope="col" className="px-4 py-2">Tipo</th>
                                <th scope="col" className="px-4 py-2">Valor</th>
                                <th scope="col" className="px-4 py-2">Fecha</th>
                                <th scope="col" className="px-4 py-2 hidden lg:table-cell">Voucher</th>
                                <th scope="col" className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyList?.slice(pageNumber * withdrawPerPage, (pageNumber + 1) * withdrawPerPage).map((obj, index) => (
                                <tr key={index} className="border-b border-slate-700 uppercase text-xs text-white">
                                    <td className="whitespace-nowrap px-4 py-2 font-Courier font-semibold">{obj.type == "Invoice" ? "ADD" :obj.type == "Withdraw" ? "OUT": "N/A"}</td>
                                    <td className="whitespace-nowrap px-4 py-2">${obj.amount}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{obj.date}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-[0.65rem] hidden lg:table-cell">{obj.voucher}</td>
                                    <td className="whitespace-nowrap px-4 py-2text-center align-middle">
                                        {obj.state == "pending" ? <p className='text-yellow-300'><GoAlertFill /></p> : obj.state == "done" ? <p className='text-green-300'><GiCheckMark /></p> : <p className='text-red-700'><GiCrossMark /></p>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={<MdNavigateBefore/>}
                        nextLabel={<MdNavigateNext/>}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={5}
                        onPageChange={changePage}
                        className={'absolute bottom-3 w-full flex flex-row items-center justify-center gap-x-2'}
                        pageClassName={'bg-slate-700 rounded-full !px-3 !py-0 transition-colors duration-300'}
                        activeClassName={'bg-slate-600 text-slate-600 rounded-full !px-3 !py-0 transition-colors duration-300'}
                        previousClassName={'absolute left-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}
                        nextClassName={'absolute right-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'} 
                    />
                </div>
            ) : (
                <div className='w-full h-full flex flex-col justify-start items-center'>
                    <span className='text-center text-gray-300 my-4 text-[0.55rem] md:text-xs'>
                        <p>¡Aun No hay Historial disponible!</p>
                        <p>Realiza una recarga de saldo desde nuestro portal</p>
                    </span>
                </div>
            )}
        </div>
    );
};

export default ListHistoryWalletModal;
