import React, { useState } from "react";
import { Session } from 'next-auth';
import Image from 'next/image';


type SelectFrameModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
  toggleSelectFrame: (value: boolean) => void;
  selectedFrame: any;
  updateFormData: (data: any) => void,
};

const SelectFrameModal: React.FC<SelectFrameModalProps> = ({ closeModal, session, toggleSelectFrame, selectedFrame, updateFormData }) => {
  const [selectFrame, setSelectFrame] = useState(false);
  const handleFrameClick = (i: number) => {
    toggleSelectFrame(false);
    if (session && session.user) {
      const newFrame = i.toString();
      session.user.frame = newFrame;
      updateFormData({ frame: newFrame });
    }
  };

  const xFrames = 12;
  const imagesArray = Array.from({ length: xFrames });

  return (
    <div>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 ml-2">
        {imagesArray.map((_, i) => (
          <Image key={i} onClick={() => handleFrameClick(i)} width={480} height={480} src={`/assets/demo/xFrame${i}.png`} className={`h-20 !bg-transparent w-auto object-cover rounded-md z-0 cursor-pointer animate-fade-in animate__animated animate__fadeIn ${i > 9 ?  'lg:hidden' : ''}`} alt=""/>
        ))}
      </div>
    </div>
  );
};

export default SelectFrameModal;
