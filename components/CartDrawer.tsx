
import React, { useState } from 'react';
import { CartItem, Language } from '../types';
import { WILAYAS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, d: number) => void;
  removeFromCart: (id: string) => void;
  onPlaceOrder: (details: { name: string; phone: string; wilaya: string; address: string }) => void;
  t: (key: string) => string;
  lang: Language;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, onPlaceOrder, t, lang }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', wilaya: WILAYAS[15], address: '' });
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
    if (!isValid || cart.length === 0 || loading) return;

    setLoading(true);
    try {
      await onPlaceOrder(formData);
      setFormData({ name: '', phone: '', wilaya: WILAYAS[15], address: '' });
    } catch (err) {
      console.error('Order submit failed:', err);
      alert('Order could not be placed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    formData.name.trim().length > 1 &&
    formData.phone.trim().length >= 6 &&
    formData.address.trim().length > 4;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-full max-w-full sm:max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in ${lang === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} duration-500`}>
        <div className="p-5 sm:p-8 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <span className="text-2xl">🛍️</span>
             <h2 className="text-2xl font-black text-zinc-950 tracking-tight">{t('cart')}</h2>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all font-black text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 sm:space-y-10">
          {cart.length === 0 ? (
            <div className="text-center py-32 space-y-4">
              <span className="text-6xl block opacity-20">🛒</span>
              <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">
                {t('empty_cart')}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="group flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 bg-zinc-50 rounded-[2rem] border border-zinc-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50">
                    <div className="flex gap-4 items-start">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm flex-shrink-0" alt="" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="font-black text-zinc-900 leading-tight pr-1 sm:pr-4 text-sm sm:text-base">{item.name[lang]}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                            title="Remove"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <div className="flex items-center bg-white border border-zinc-200 rounded-xl px-2 py-1 shadow-sm">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-lg font-black text-zinc-400 hover:text-zinc-950">-</button>
                            <span className="w-10 text-center text-xs font-black text-zinc-950">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-lg font-black text-zinc-400 hover:text-zinc-950">+</button>
                          </div>
                          <span className="font-black text-[#d97706] text-sm sm:text-base">{item.price * item.quantity} {t('currency')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-10 space-y-6">
                <div className="flex items-center gap-2">
                   <div className="h-1 w-8 bg-[#d97706] rounded-full"></div>
                   <h3 className="font-black text-zinc-950 uppercase tracking-tighter text-lg">{t('checkout')}</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">{t('full_name')}</label>
                    <input className="w-full p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200 outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-950 transition-all font-bold text-sm sm:text-base" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">{t('phone')}</label>
                    <input type="tel" className="w-full p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200 outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-950 transition-all font-bold text-sm sm:text-base" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">{t('wilaya')}</label>
                    <select className="w-full p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200 outline-none font-bold appearance-none cursor-pointer text-sm sm:text-base" value={formData.wilaya} onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}>
                      {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">{t('address')}</label>
                    <input className="w-full p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200 outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-950 transition-all font-bold text-sm sm:text-base" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 sm:p-8 bg-white border-t border-zinc-100 space-y-6 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center text-2xl font-black text-zinc-950 px-2">
              <span className="text-zinc-400 text-sm uppercase tracking-widest">{t('total')}</span>
              <span className="text-[#d97706]">{total.toLocaleString()} {t('currency')}</span>
            </div>
            <button 
              disabled={!isValid || loading}
              onClick={handleSubmit}
              className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all relative overflow-hidden group ${isValid && !loading ? 'bg-zinc-950 text-white hover:bg-[#d97706]' : 'bg-zinc-100 text-zinc-300 pointer-events-none'}`}
            >
              <span className={loading ? 'opacity-0' : 'opacity-100'}>{t('confirm_order')}</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
