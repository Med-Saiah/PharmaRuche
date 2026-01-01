
import React from 'react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg p-12 rounded-[3rem] shadow-2xl text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
           ✅
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">{t('order_success_title')}</h2>
        <p className="text-slate-500 leading-relaxed mb-10 text-lg">
          {t('order_success_desc')}
        </p>
        <button 
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
