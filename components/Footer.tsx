
import React from 'react';
import { Language } from '../types';

interface FooterProps {
  t: (key: string) => string;
  lang: Language;
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ t, lang, onAdminClick }) => {
  const socialLinks = [
    { label: 'Facebook', icon: 'FB', url: '#' },
    { label: 'Instagram', icon: 'IG', url: '#' },
    { label: 'WhatsApp', icon: 'WA', url: 'https://wa.me/213550001122' },
  ];

  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-10 px-6 border-t-4 border-[#d97706]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div className="space-y-4">
          <img src="/brand-logo.svg" alt="Pharma Ruche" className="w-44" />
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
            {lang === 'ar' ? 'عسل خام من مناحل أسامة الصغير، معتمد على الشفافية والجودة.' :
             'Raw honey from Osama Essghayer apiaries, crafted with transparency and quality first.'}
          </p>
          <div className="flex gap-3">
            {socialLinks.map(social => (
              <a key={social.label} href={social.url} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-black hover:bg-[#d97706] transition-colors">{social.icon}</a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#d97706]">{t('products')}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-zinc-300 font-medium">
            <a href="#products" className="hover:text-white transition-colors">Eucalyptus</a>
            <a href="#products" className="hover:text-white transition-colors">Sidr</a>
            <a href="#products" className="hover:text-white transition-colors">Pollen</a>
            <a href="#reviews" className="hover:text-white transition-colors">{t('reviews')}</a>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#d97706]">{t('contact')}</h3>
          <p className="text-sm text-zinc-300 font-bold">0550 00 11 22</p>
          <p className="text-sm text-zinc-400">hello@pharmaruche.dz</p>
          <p className="text-sm text-zinc-400">Alger, Algérie</p>
          <button onClick={onAdminClick} className="text-xs font-black uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors">{t('admin_access')}</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
        <p>&copy; 2024 {t('shop_name')}. Direct du producteur.</p>
        <span className="text-white text-xs font-semibold">مناحل أسامة الصغير</span>
      </div>
    </footer>
  );
};

export default Footer;
