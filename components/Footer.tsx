
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
    <footer className="bg-zinc-950 text-white pt-16 pb-12 px-6 md:px-8 border-t-4 border-[#d97706]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start mb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Pharma Ruche Logo" className="h-16 w-auto drop-shadow-lg hover:scale-105 transition-transform" />
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {lang === 'ar' ? 'عسل خام من مناحل أسامة الصغير، معتمد على الشفافية والجودة.' :
             'Raw honey from Osama Essghayer apiaries, crafted with transparency and quality first.'}
          </p>
          <div className="flex gap-3 pt-2">
            {socialLinks.map(social => (
              <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-[#d97706]/10 hover:bg-[#d97706] rounded-xl flex items-center justify-center text-[11px] font-black text-[#d97706] hover:text-white transition-all duration-300 border border-[#d97706]/20 hover:border-[#d97706]" title={social.label}>{social.icon}</a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-[#d97706] border-b border-[#d97706]/30 pb-3">{t('products')}</h4>
          <div className="space-y-3 text-sm">
            <a href="#products" className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium">Eucalyptus</a>
            <a href="#products" className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium">Sidr</a>
            <a href="#products" className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium">Pollen</a>
            <a href="#reviews" className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium">{t('reviews')}</a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-[#d97706] border-b border-[#d97706]/30 pb-3">{t('contact')}</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3 group">
              <span className="text-lg text-[#d97706] mt-0.5">📞</span>
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Phone</p>
                <p className="text-sm text-zinc-300 font-bold hover:text-[#d97706] transition-colors">0550 00 11 22</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group">
              <span className="text-lg text-[#d97706] mt-0.5">✉️</span>
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Email</p>
                <p className="text-sm text-zinc-300 hover:text-[#d97706] transition-colors break-all">hello@pharmaruche.dz</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group">
              <span className="text-lg text-[#d97706] mt-0.5">📍</span>
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Location</p>
                <p className="text-sm text-zinc-300">Alger, Algérie</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-[#d97706] border-b border-[#d97706]/30 pb-3">Support</h4>
          <div className="space-y-3 text-sm">
            <button onClick={onAdminClick} className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium text-left">{t('admin_access')}</button>
            <a href="#products" className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium">FAQ</a>
            <a href="#contact" className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium">Shipping Info</a>
            <a href="#contact" className="block text-zinc-300 hover:text-[#d97706] transition-colors font-medium">Returns</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-400">
        <p className="font-medium">&copy; 2024 {t('shop_name')}. Direct du producteur.</p>
        <p className="text-zinc-500 text-xs">مناحل أسامة الصغير</p>
      </div>
    </footer>
  );
};

export default Footer;
