import React from "react";
import Image from 'next/image';

import {FaDollarSign} from 'react-icons/fa6';
import {HiShare} from 'react-icons/hi'
import {IoMdHelp} from 'react-icons/io'
import {ImTrophy} from 'react-icons/im'

import Tooltip from './tooltip';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 w-full h-14 bg-gray-900 z-10">
            <div className="w-full h-full flex flex-row items-center px-4 py-1">
                <Tooltip Icon={<FaDollarSign />} Text="Sorteos" Link="/"/>
                <Tooltip Icon={<ImTrophy />} Text="Ganadores" Link="/"/>
                <div className="w-1/5 relative flex justify-center cursor-pointer">
                    <button className="absolute -top-12 rounded-full px-2 py-1 bg-white h-16 w-16 border-4 border-gray-900 bg-gradient-to-b from-yellow-400 to-red-800">
                        <Image width={150} height={150} src={"/assets/animations/animatedWallet.gif"} className="scale-150" alt="" />
                    </button>
                </div>
                <Tooltip Icon={<HiShare />} Text="Compartir" Link="/"/>
                <Tooltip Icon={<IoMdHelp />} Text="Soporte" Link="/"/>
            </div>
        </footer>
    );
};

export default Footer;