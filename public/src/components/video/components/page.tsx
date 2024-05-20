import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import ReactPlayer from 'react-player';
import { NextResponse } from 'next/server';

import { InfoType } from '@/lib/types/types';

import { MdQuestionMark } from 'react-icons/md';


import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'


export const fetchInfo = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/app/core/fetch-info/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('infoData', JSON.stringify(data));
      NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });
      return data;
    }


  } catch (error) {
    return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
  }
}

const VideoModal: React.FC= () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoUrl, setVideo] = useState<string>("");

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    fetchInfo()
      .then((data: InfoType) => {
        localStorage.setItem('infoData', JSON.stringify(data));
        const infoData = localStorage.getItem('infoData');
        if (infoData) {
          const parsedData = JSON.parse(infoData);
          if (parsedData.video) {
            setVideo(parsedData.video);
          }
        }
      })
      .catch((error) => {
        NextResponse.json({ error: 'Server responded with an error' });
      });
  }, []);

  return (
    <div>
      <button className="fixed left-[0.85rem] bottom-16 bg-gray-300 text-black border border-gray-600 rounded-full p-2" onClick={openModal}>
        <MdQuestionMark size={24} data-tooltip-id="VideoModal" data-tooltip-content="Tutorial" data-tooltip-place="top" /><Tooltip id="VideoModal"/>
      </button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            padding: '30px',
            overflow: 'hidden',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
          },
        }}
      >
        <button
          onClick={closeModal}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#fff',
          }}
        >
          ×
        </button>
        <ReactPlayer 
          url={videoUrl}
          playing 
          controls
          width="1280px"
          height="720px"
        />
      </ReactModal>
    </div>
  );
};

export default VideoModal;
