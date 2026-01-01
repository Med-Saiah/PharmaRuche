
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  cartCount: number;
  onCartClick: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  t: (key: string) => string;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, cartCount, onCartClick, t }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? 'bg-white/95 backdrop-blur-xl border-zinc-200/60 py-3 shadow-sm' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Brand */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg group-hover:bg-[#d97706] transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="text-left rtl:text-right">
            <h1 className={`text-lg font-black tracking-tight leading-none ${scrolled ? 'text-zinc-900' : 'text-zinc-900 md:text-white'}`}>
              {t('shop_name')}
            </h1>
          </div>
        </button>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden md:flex bg-zinc-100/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
            {(['ar', 'fr', 'en'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${lang === l ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Cart Button */}
          <button 
            onClick={onCartClick}
            className="group relative flex items-center gap-3 px-5 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-[#d97706] transition-all shadow-lg active:scale-95"
          >
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">{t('cart')}</span>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-zinc-900 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
