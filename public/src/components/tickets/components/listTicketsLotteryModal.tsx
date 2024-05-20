import React, { useState, useEffect } from "react";
import { NextResponse } from 'next/server';
import ReactPaginate from 'react-paginate';

import { SessionModal, LotteryTicketDetails  } from '@/lib/types/types';

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { GiCheckMark , GiCrossMark } from "react-icons/gi";

export const fetchLotteryTickets = async (accessToken: any) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/app/lottery/fetch-all-lottery-tickets/`,
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


const ListTicketsLotteryModal: React.FC<SessionModal>  = ({closeModal, session }) => {

    const [lotteryTickets, setLotteryTickets] = useState<LotteryTicketDetails[]>([]);
    
    const [pageNumber, setPageNumber] = useState(0);
    const ticketsPerPage = 5;
  
    useEffect(() => {
      if (session) {
        const accessToken = session.user.accessToken;
        const fetchData = async () => {
          await fetchLotteryTickets(accessToken)
          .then((data) => {
            setLotteryTickets(data);
          })
          .catch((error) => {
            NextResponse.json({ error: 'Server responded with an error' });
          }); 
        };
        fetchData();
      }
    }, [session]);
  
    const pageCount = Math.ceil(lotteryTickets.length/ticketsPerPage);
  
    const changePage = ({ selected }: { selected: number }) => {
      setPageNumber(selected);
    };
  
    return (
      <div className="relative h-full w-full text-gray-500">
        {lotteryTickets? (
          lotteryTickets.length > 0 ? (
            <div>
              <ul>
                <table className="min-w-full text-center text-sm font-light">
                  <thead className="font-medium text-white">
                    <tr className="border-b border-slate-900 uppercase text-xs">
                      <th scope="col" className=" px-6 py-2">Ticket</th>
                      <th scope="col" className=" px-6 py-2">Loteria</th>
                      <th scope="col" className=" px-6 py-2 hidden lg:table-cell">PIN</th>
                      <th scope="col" className=" px-6 py-2 hidden sm:table-cell">Fecha</th>
                      <th scope="col" className=" px-6 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotteryTickets?.slice(pageNumber * ticketsPerPage, (pageNumber + 1) * ticketsPerPage).map((obj: any, index: number) => (
                      <tr key={index} className="border-b border-slate-700 uppercase text-xs text-white justify-center">
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4 lg:px-6">{obj.ticket}</td>
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4 lg:px-6 font-courier font-semibold">{obj.uuid}</td>
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4 lg:px-6 hidden lg:table-cell">{obj.voucher}</td>
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4 lg:px-6 hidden sm:table-cell">{obj.date}</td>
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4 lg:px-6">
                            {obj.is_active ? <p className='text-green-300'><GiCheckMark  /></p> : <p className='text-red-500'><GiCrossMark /></p>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ul>
              <ReactPaginate
                previousLabel={<MdNavigateBefore/>}
                nextLabel={<MdNavigateNext/>}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={0}
                pageRangeDisplayed={5}
                onPageChange={changePage}
                className={'absolute -bottom-1 w-full flex flex-row items-center justify-center gap-x-2'}
                pageClassName={'bg-slate-700 rounded-full !px-3 !py-0 transition-colors duration-300'}
                activeClassName={'bg-slate-600 text-slate-600 rounded-full !px-3 !py-0 transition-colors duration-300'}
                previousClassName={'absolute left-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}
                nextClassName={'absolute right-5 bg-slate-700 rounded-full p-1 transition-colors duration-300'}
              />
            </div>
          ) : (
            <div className='w-full h-full flex flex-col justify-start items-center'>
              <span className='text-center text-gray-300 my-4 text-[0.55rem] md:text-xs'>
                <p>¡Aun no has adquirido ningún ticket para esta lotería!</p>
                <p>Adquiérelo ahora y participa en el siguiente sorteo.</p>
              </span>
            </div>
          )) : ( null
        )}
      </div>
    );
  };
  
  export default ListTicketsLotteryModal;
  
