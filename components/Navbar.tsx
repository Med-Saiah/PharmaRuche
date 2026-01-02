
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
    <nav
      dir="ltr"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-amber-100 shadow-lg shadow-amber-100/40 py-3'
          : 'bg-gradient-to-b from-black/70 via-black/40 to-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-4 group focus:outline-none"
        >
          <span className="relative w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shadow-amber-200/30">
            <img src="/brand-logo.svg" alt="Pharma Ruche" className="w-10 h-10" />
            <span className="absolute -bottom-2 right-1 bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
              100%
            </span>
          </span>
          <div className="text-left">
            <p className={`text-xs font-black uppercase tracking-[0.35em] ${scrolled ? 'text-amber-700' : 'text-amber-100'} transition-colors`}>
              Pharma Ruche
            </p>
            <p className={`${scrolled ? 'text-zinc-600' : 'text-white'} font-black text-sm`}>مناحل أسامة الصغير</p>
            <p className={`text-[11px] font-semibold ${scrolled ? 'text-amber-600' : 'text-amber-200'} uppercase tracking-[0.25em]`}>Direct du Producteur</p>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-6">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[12px] font-black uppercase tracking-[0.22em] px-3 py-2 rounded-full transition-all ${
                scrolled
                  ? 'text-zinc-700 hover:text-zinc-900 hover:bg-amber-50'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="hidden md:flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-inner shadow-amber-200/30">
            {(['ar', 'fr', 'en'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                  lang === l
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : scrolled
                      ? 'text-zinc-500 hover:text-zinc-900'
                      : 'text-amber-100 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="group relative flex items-center gap-3 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-600/30 active:scale-95"
          >
            <span className="text-sm font-black uppercase tracking-[0.2em] hidden sm:block">{t('cart')}</span>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-amber-700 text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={onAdminClick}
            className={`hidden md:inline-flex items-center justify-center w-11 h-11 rounded-full border-2 transition-colors ${
              scrolled
                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                : 'border-white/40 text-white hover:bg-white/10'
            }`}
            title={t('admin_access')}
          >
            🔒
          </button>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors ${
              scrolled ? 'border-amber-200 text-amber-700' : 'border-white/40 text-white'
            }`}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-amber-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-amber-800 font-black uppercase tracking-[0.22em] px-3 py-2 rounded-xl hover:bg-amber-50"
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
