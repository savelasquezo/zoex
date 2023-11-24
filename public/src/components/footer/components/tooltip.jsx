import React from 'react';

const Tooltip = ({ Icon, Text }) => {
  return (<>
        <p className="text-lg text-center bg-gradient-to-b from-yellow-400 to-red-800 rounded-full p-2">{Icon}</p>
        <div className="text-white [transform:perspective(50px)_translateZ(0)_rotateX(10deg)] group-hover:[transform:perspective(0px)_translateZ(0)_rotateX(0deg)] absolute bottom-0 mb-8 origin-bottom rounded opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex max-w-xs flex-col items-center">
                <div className="rounded-sm bg-gray-200 text-gray-900 font-semibold p-2 text-[0.6rem] text-center shadow-lg uppercase -mb-1">{Text}</div>
                <div className="h-2 w-4 bg-gray-200" style={{ clipPath: "polygon(100% 50%, 0 0, 100% 0, 50% 100%, 0 0)" }}></div>
            </div>
        </div>
    </>);
};

export default Tooltip