
import { Session } from 'next-auth';

export type SessionInfo = {
    session: Session | null | undefined;
};

export type ModalFunction = {
    closeModal: () => void;
};

export type ForgotPasswordConfirmProps = {
    updateForgotPasswordModalState: (value: boolean) => void;
};

export type InfoType = {
    stream: string;
    phone: string;
    facebook: string;
    twitter: string;
    instagram: string;
    hashtag: string;
    bonusPercent: number;
    referredPercent: number;
};

export type ImagenSlider = {
    settings: any;
    file: string;
};

export type LotteryData = {
    id: any;
    file: string;
    mfile: string;
    lottery: string;
    prize: number;
    tickets: number;
    price: number;
    winner: string | null | undefined;
    date_lottery: string;
    sold: number;
    date_results: string;
    stream: string | null | undefined;
    amount: number;
    is_active: boolean
};

export type LotteryTicketDetails = {
    id:number;
    uuid: string;
    ticket: string;
    date: string;
    voucher: string;
    lottery: number;
    email: any;
    lotteryID: string;
    is_active: boolean;
};

export type GiveawayData = {
    id: any;
    file: string;
    mfile: string;
    giveaway: string;
    prize: string;
    tickets: number;
    price: number;
    winner: string | null | undefined;
    date_giveaway: string;
    sold: number;
    date_results: string;
    stream: string | null | undefined;
    amount: number;
    is_active: boolean;
    progress: number
};

export type GiveawayTicketDetails = {
    id: number;
    uuid: string;
    ticket: string;
    date: string;
    voucher: string;
    giveaway: number;
    email: any;
    giveawayID: string;
    is_active: boolean;
};

export type HistoryDetails = {
    id: string;
    type: string;
    amount: number;
    date: string;
    voucher: string;
    state: string;
};


export type FeesReferedInfo = {
    username: string;
    fee: number;
    date: string;
};


export type SelectFrame = {
    selectedFrame: any;
    updateFormData: (data: any) => void;
    toggleSelectFrame: (value: boolean) => void;
};

export type InfoProfile = {
    formData: any;
    updateFormData: (data: any) => void,
    toggleSelectFrame: (value: boolean) => void;
};
  

export type SessionModal = SessionInfo & ModalFunction;
export type ForgotPasswordConfirmModal = ForgotPasswordConfirmProps & ModalFunction;

export type InfoProfileModalProps = SessionModal & InfoProfile
export type SelectFrameModalProps = SessionModal & SelectFrame