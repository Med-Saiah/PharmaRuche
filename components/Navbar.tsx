
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md border-amber-100 shadow-lg shadow-amber-100/30 py-2.5'
          : 'bg-gradient-to-b from-black/60 via-black/40 to-transparent border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center gap-4">
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group focus:outline-none shrink-0"
        >
          <img src="/logo.png" alt="Pharma Ruche" className={`h-11 w-auto transition-all ${scrolled ? 'opacity-100' : 'opacity-95'}`} />
          <div className="hidden sm:flex flex-col">
            <p className={`text-xs font-bold uppercase tracking-[0.25em] ${scrolled ? 'text-[#d97706]' : 'text-amber-100'} transition-colors`}>
              Pharma Ruche
            </p>
            <p className={`text-[10px] font-bold ${scrolled ? 'text-zinc-600' : 'text-white/80'} transition-colors`}>مناحل أسامة الصغير</p>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-bold uppercase tracking-[0.15em] px-3 py-2 rounded-lg transition-all relative group ${
                scrolled
                  ? 'text-zinc-700 hover:text-[#d97706]'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${scrolled ? 'bg-[#d97706]' : 'bg-amber-400'} rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="hidden md:flex bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20 shadow-inner shadow-amber-200/20">
            {(['ar', 'fr', 'en'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                  lang === l
                    ? 'bg-white text-zinc-900 shadow-md'
                    : scrolled
                      ? 'text-zinc-500 hover:text-zinc-700'
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
            className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg hover:from-[#b45309] hover:to-amber-800 transition-all shadow-lg shadow-amber-600/30 active:scale-95 font-bold"
          >
            <span className="text-xs uppercase tracking-[0.15em] hidden sm:block">{t('cart')}</span>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-2.5 bg-red-500 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={onAdminClick}
            className={`hidden md:inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold transition-all ${
              scrolled
                ? 'border-[#d97706] text-[#d97706] hover:bg-[#d97706] hover:text-white'
                : 'border-white/40 text-white hover:bg-white/20'
            }`}
            title={t('admin_access')}
          >
            🔐
          </button>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold transition-all ${
              scrolled ? 'border-[#d97706] text-[#d97706]' : 'border-white/40 text-white'
            }`}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-amber-100 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-5 space-y-1">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-amber-800 font-bold uppercase tracking-[0.15em] px-4 py-3 rounded-lg hover:bg-amber-50 transition-colors"
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
