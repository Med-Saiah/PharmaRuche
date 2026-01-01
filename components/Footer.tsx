
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
    <footer className="bg-zinc-900 text-white pt-24 pb-8 px-6 border-t-4 border-[#d97706]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">🍯</div>
             <h2 className="text-xl font-black tracking-tight">{t('shop_name')}</h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            {lang === 'ar' ? 'الجودة الصيدلانية تلتقي بخيرات الطبيعة. مختبر متخصص في منتجات النحل.' : 
             'Pharmaceutical quality meets nature\'s bounty. A specialized laboratory for bee products.'}
          </p>
          <div className="flex gap-3">
            {socialLinks.map(social => (
              <a key={social.label} href={social.url} className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] font-black hover:bg-[#d97706] transition-colors">{social.icon}</a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#d97706] mb-6">{t('dashboard')}</h3>
           <ul className="space-y-3 text-sm text-zinc-400 font-medium">
             <li><a href="#home" className="hover:text-white transition-colors">{t('home')}</a></li>
             <li><a href="#products" className="hover:text-white transition-colors">{t('products')}</a></li>
             <li><a href="#about" className="hover:text-white transition-colors">{t('about_us')}</a></li>
             <li><a href="#contact" className="hover:text-white transition-colors">{t('contact')}</a></li>
           </ul>
        </div>

        {/* Contact Info */}
        <div className="col-span-1 lg:col-span-2">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#d97706] mb-6">{t('contact')}</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                 <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Phone</p>
                 <p className="text-sm font-bold">0550 00 11 22</p>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                 <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Email</p>
                 <p className="text-sm font-bold">hello@pharmaruche.dz</p>
              </div>
           </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
        <p>&copy; 2024 {t('shop_name')}.</p>
        <div className="flex items-center gap-6">
           {/* Discrete Admin Link */}
           <button onClick={onAdminClick} className="flex items-center gap-2 hover:text-white transition-colors">
             <span>🔒</span> {t('admin_access')}
           </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
