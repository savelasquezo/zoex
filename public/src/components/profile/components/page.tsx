import React, { useState } from "react";
import { Session } from 'next-auth';

import InfoProfileModal from "@/components/profile/components/infoProfileModal";
import SelectFrameModal from "@/components/profile/components/selectFrameModal";

type ProfileModalProps = {
  closeModal: () => void;
  session: Session | null | undefined;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ closeModal, session  }) => {

  const [selectFrame, setSelectFrame] = useState(false);
  const [formData, setFormData] = useState({
    frame: session?.user.frame,
    location: '',
    billing: '',
  });

  const toggleSelectFrame = (value: boolean) => {
    setSelectFrame(value);
  };

  const updateFormData = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  return (
    <div className="w-full h-96 lg:h-40">
      {!selectFrame ? (
        <InfoProfileModal closeModal={closeModal} session={session} toggleSelectFrame={toggleSelectFrame} formData={formData} updateFormData={updateFormData}/>
      ) :
        <SelectFrameModal closeModal={closeModal} session={session} toggleSelectFrame={toggleSelectFrame} selectedFrame={formData.frame} updateFormData={updateFormData}/>
      }
  </div>
  );
};

export default ProfileModal;
