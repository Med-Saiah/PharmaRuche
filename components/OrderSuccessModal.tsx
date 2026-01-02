
import React, { useEffect, useState } from 'react';
import { Language, Order } from '../types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (rating: number, comment: string) => void;
  order: Order | null;
  lang: Language;
  t: (key: string) => string;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, onSubmitFeedback, order, lang, t }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (order) {
      setRating(5);
      setComment('');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl p-10 md:p-12 rounded-[3rem] shadow-2xl text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
           ✅
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">{t('order_success_title')}</h2>
        <p className="text-slate-500 leading-relaxed mb-6 text-lg">
          {t('order_success_desc')}
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left mb-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-600 mb-2">{t('feedback_prompt')}</p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="font-bold text-zinc-900">#{order.id}</div>
            <div className="text-xs text-zinc-500 font-mono">{order.customerName}</div>
          </div>
        </div>

        <div className="space-y-4 text-left">
          <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 block">{t('rating')}</label>
          <div className="flex gap-2 text-2xl">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${rating >= value ? 'bg-amber-500 text-white border-amber-500' : 'border-zinc-200 text-zinc-400 hover:border-amber-300 hover:text-amber-500'}`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 block">{t('comment')}</label>
            <textarea
              className="w-full border-2 border-zinc-200 rounded-2xl p-4 text-sm focus:border-amber-500 focus:ring-0 outline-none"
              rows={3}
              value={comment}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              onChange={(e) => setComment(e.target.value)}
              placeholder={lang === 'ar' ? 'حدثنا عن تجربتك مع التوصيل والجودة' : 'Tell us about the delivery and product quality'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          <button
            onClick={onClose}
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-black py-4 rounded-2xl transition-all uppercase tracking-widest"
          >
            {t('close')}
          </button>
          <button
            onClick={() => onSubmitFeedback(rating, comment)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest"
          >
            {t('submit_feedback')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
