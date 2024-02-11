import React, { useState, useEffect } from "react";
import { NextResponse } from 'next/server';
import ReactPaginate from 'react-paginate';

import { SessionModal, FeesReferedInfo  } from '@/lib/types/types';

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";

export const fetchInvoicesRefered = async (accessToken: any) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/app/user/fetch-invoice-refered/`,
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


const HistoryReferedModal: React.FC<SessionModal>  = ({closeModal, session }) => {

    const [feesRefered, setFeesRefered] = useState<FeesReferedInfo[]>([]);
    
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 3;
  
  
    useEffect(() => {
      if (session) {
        const accessToken = session.user.accessToken;
        const fetchData = async () => {
          await fetchInvoicesRefered(accessToken)
          .then((data) => {
            setFeesRefered(data);
          })
          .catch((error) => {
            console.error('Error getting information about tickets!', error);
          }); 
        };
        fetchData();
      }
    }, [session]);

  
    const pageCount = Math.ceil(feesRefered.length/itemsPerPage);
  
    const changePage = ({ selected }: { selected: number }) => {
      setPageNumber(selected);
    };
  
    return (
      <div className="relative h-full w-full text-gray-500">
        {feesRefered? (
          feesRefered.length > 0 ? (
            <div>
              <ul>
                <table className="min-w-full text-center text-sm font-light">
                  <thead className="font-medium text-white">
                    <tr className="border-b border-slate-900 uppercase text-xs">
                      <th scope="col" className=" px-6 py-2">Usuario</th>
                      <th scope="col" className=" px-6 py-2">Comicion</th>
                      <th scope="col" className=" px-6 py-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesRefered?.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage).map((obj: any, i: number) => (
                      <tr key={i} className="border-b border-slate-700 uppercase text-xs text-white justify-center">
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4 lowercase">{obj.username}</td>
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4">${obj.fee}</td>
                        <td className="text-center align-middle whitespace-nowrap py-2 px-4">{obj.date}</td>
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
                <p>¡Aún no has recibido comisiones de referidos de plataforma!</p>
                <p>comparte ahora tu link y genera comisiones</p>
              </span>
            </div>
          )) : ( null
        )}
      </div>
    );
  };
  
  export default HistoryReferedModal;
  
