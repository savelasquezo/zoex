import React, { useState, useEffect } from "react";
import { Session } from 'next-auth';
import ReactPaginate from 'react-paginate';
import { fetchLotteryTickets } from '@/app/api/tickets/lottery/route';
import { fetchGiveawayTickets } from '@/app/api/tickets/giveaway/route';

type TicketsModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
};

type LotteryTicketType = {
  lottery: string;
  ticket: string;
  date: string;
  voucher: string;
};

type GiveawayTicketType = {
  giveaway: string;
  ticket: string;
  date: string;
  voucher: string;
};

const TicketsModal: React.FC<TicketsModalProps> = ({ closeModal, session }) => {
  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState('lottery-tickets');
  const [tickets, setTickets] = useState<LotteryTicketType[]>([]);
  const [giveawayTickets, setGiveawayTickets] = useState<GiveawayTicketType[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const ticketsPerPage = 1;

  useEffect(() => {
    if (session) {
      const accessToken = session.user.accessToken;
      const fetchTickets = activeTab === 'lottery-tickets' ? fetchLotteryTickets : fetchGiveawayTickets;

      fetchTickets(accessToken)
        .then((data) => {
          if (activeTab === 'lottery-tickets') {
            setTickets(data);
          } else {
            setGiveawayTickets(data);
          }
        })
        .catch((error) => {
          console.error('Error getting information about tickets!', error);
        });
    }
  }, [activeTab, session]);

  const pageCount = Math.ceil(activeTab === 'lottery-tickets' ? tickets.length : giveawayTickets.length) / ticketsPerPage;

  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };

  const displayTickets = (activeTab === 'lottery-tickets' ? tickets : giveawayTickets)
  .slice(pageNumber * ticketsPerPage, (pageNumber + 1) * ticketsPerPage)
  .map((ticket, index) => (
    <li key={index} className="flex flex-row ticket-item">
      <p>{activeTab === 'lottery-tickets' ? 'Lottery' : 'Giveaway'}: {activeTab === 'lottery-tickets' ? (ticket as LotteryTicketType).lottery : (ticket as GiveawayTicketType).giveaway}</p>
      <p>Ticket: {ticket.ticket}</p>
      <p>Date: {ticket.date}</p>
      <p>Voucher: {ticket.voucher}</p>
    </li>
  ));

  return (
    <div>
      <div className='absolute top-4 inline-flex gap-x-1 w-full justify-start items-center z-0'>
        <button onClick={() => setActiveTab('lottery-tickets')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'lottery-tickets' ? 'bg-red-500 hover:bg-red-600' : ''}`}>Loteria</button>
        <button onClick={() => setActiveTab('giveaway-tickets')} className={`text-gray-100 rounded-lg px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'giveaway-tickets' ? 'bg-pink-700 hover:bg-pink-800' : ''}`}>Sorteos</button>
      </div>

      {showModal && (
        <div className="mt-10">
          <div style={{ display: activeTab === 'lottery-tickets' ? 'block' : 'none' }} className={`tickets-list ${activeTab === 'giveaway-tickets' ? 'hidden' : ''}`}>
            {tickets.length > 0 ? (
              <>
                <ul>{displayTickets}</ul>
                <ReactPaginate
                  previousLabel={'Anterior'}
                  nextLabel={'Siguiente'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={changePage}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                />
              </>
            ) : (
              <p>Cargando tickets...</p>
            )}
          </div>
          <div style={{ display: activeTab === 'giveaway-tickets' ? 'block' : 'none' }} className={`tickets-list ${activeTab === 'lottery-tickets' ? 'hidden' : ''}`}>
            {giveawayTickets.length > 0 ? (
              <>
                <ul>{displayTickets}</ul>
                <ReactPaginate
                  previousLabel={'Anterior'}
                  nextLabel={'Siguiente'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={Math.ceil(giveawayTickets.length / ticketsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={changePage}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                />
              </>
            ) : (
              <p>Cargando tickets...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsModal;
