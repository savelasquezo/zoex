import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

function getRandomTickets(aviableTickets, num) {
  const shuffledTickets = aviableTickets.slice();
  let selectedTickets = [];

  while (selectedTickets.length < num && shuffledTickets.length > 0) {
    const randomIndex = Math.floor(Math.random() * shuffledTickets.length);
    selectedTickets.push(shuffledTickets[randomIndex]);
    shuffledTickets.splice(randomIndex, 1);
  }

  return selectedTickets;
}

const TicketsLotteryModal = ({ closeModal }) => {
  const [aviableTickets, setAviableTickets] = useState([]);
  const [generateNewNumbers, setGenerateNewNumbers] = useState(true);

  const handleGenerateNewNumbers = () => {
    setGenerateNewNumbers(true);
  };
  
  useEffect(() => {
    const websocketURL = `ws://${process.env.NEXT_PUBLIC_APP_URL}/ws/tickets_lottery/`;
    const client = new W3CWebSocket(websocketURL);

    client.onopen = (message) => {
      console.log('Conexión WebSocket abierta');
    };

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (generateNewNumbers) {
        const randomTickets = getRandomTickets(data.iTickets, 5);
        setAviableTickets(randomTickets);
        setGenerateNewNumbers(false);
      }
    };

    client.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    client.onerror = (error) => {
      console.error('Error de conexión WebSocket:', error);
    };

    return () => {
      if (client.readyState === client.OPEN) {
        client.close();
      }
    };
  }, [generateNewNumbers]);

  useEffect(() => {
    handleGenerateNewNumbers();
  }, []);


  return (
    <div>
      {aviableTickets ? (
        <div className='flex flex-row overflow-scroll gap-x-2'>
          {aviableTickets.map((aviableTicket, i) => (
            <p key={i} className='text-white text-xl uppercase font-semibold'>{aviableTicket}</p>
          ))}
        </div>
      ) : (
        <p>No hay información que mostrar</p>
      )}

      <button onClick={handleGenerateNewNumbers}>Generar Nuevos Números </button>
    </div>
  );
};

export default TicketsLotteryModal;
