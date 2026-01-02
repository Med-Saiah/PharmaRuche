
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  t: (key: string) => string;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, cartCount, onCartClick, onAdminClick, t }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#home', label: t('home') },
    { href: '#products', label: t('products') },
    { href: '#reviews', label: t('reviews') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <nav dir="ltr" className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? 'bg-white/95 backdrop-blur-xl border-zinc-200/60 py-3 shadow-sm' : 'bg-transparent border-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Brand */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <img src="/brand-logo.svg" alt="Pharma Ruche" className="w-36 md:w-44 drop-shadow-lg" />
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {links.map(link => (
            <a key={link.href} href={link.href} className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${scrolled ? 'text-zinc-600 hover:text-zinc-900' : 'text-white/80 hover:text-white'}`}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
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

          <button
            onClick={onAdminClick}
            className="hidden md:inline-flex items-center justify-center w-11 h-11 rounded-xl border-2 border-white/30 text-white hover:bg-white hover:text-zinc-900 transition-colors"
            title={t('admin_access')}
          >
            🔒
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-11 h-11 rounded-xl border-2 border-white/40 text-white flex items-center justify-center"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-zinc-200/60 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-zinc-900 font-black uppercase tracking-[0.2em]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
