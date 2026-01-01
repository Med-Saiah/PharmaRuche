
import React from 'react';
import { Product, Language } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  addToCart: (p: Product) => void;
  t: (key: string) => string;
  lang: Language;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, addToCart, t, lang }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 rounded-full shadow-md text-2xl flex items-center justify-center hover:bg-white transition">&times;</button>
        
        <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name[lang]} />
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
          <div className="space-y-2">
            <span className="text-amber-600 font-bold uppercase text-xs tracking-widest">{product.category}</span>
            <h2 className="text-3xl font-bold text-slate-900">{product.name[lang]}</h2>
            <p className="text-2xl font-bold text-amber-700">{product.price} {t('currency')}</p>
          </div>
          
          <p className="text-slate-600 leading-relaxed text-lg">
            {product.description[lang]}
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-100">
             <ul className="space-y-2 text-sm text-slate-500">
               <li>✓ {lang === 'ar' ? 'طبيعي ونقي 100%' : '100% Naturel et pur'}</li>
               <li>✓ {lang === 'ar' ? 'تم فحصه مخبرياً' : 'Analysé en laboratoire'}</li>
               <li>✓ {lang === 'ar' ? 'توصيل سريع لكل الولايات' : 'Livraison rapide partout'}</li>
             </ul>
             
             <button 
              onClick={() => { addToCart(product); onClose(); }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3"
             >
               <span className="text-xl">🛒</span> {t('add_to_cart')}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
