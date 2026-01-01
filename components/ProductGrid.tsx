
import React, { useState } from 'react';
import { Product, Language } from '../types';

interface ProductGridProps {
  products: Product[];
  addToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  t: (key: string) => string;
  lang: Language;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, addToCart, onSelectProduct, t, lang }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Honey', 'Supplements'];

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="space-y-16">
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setFilter(c)}
            className={`px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${filter === c ? 'bg-[#15803d] text-white shadow-2xl' : 'bg-white text-slate-400 border border-slate-100 hover:border-[#15803d] hover:text-[#15803d]'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(21,128,61,0.15)] transition-all duration-700 border border-slate-50 group flex flex-col">
            <div className="relative h-80 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
              <img 
                src={product.image} 
                alt={product.name[lang]} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-8 right-8 bg-red-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/20">
                ✨ 100% NATURAL
              </div>
              <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl text-[#15803d] font-black text-xl shadow-2xl">
                {product.price} {t('currency')}
              </div>
            </div>
            
            <div className="p-12 flex-1 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f59e0b] mb-4">{product.category}</span>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#15803d] transition-colors leading-tight">{product.name[lang]}</h3>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed opacity-80 line-clamp-2">{product.description[lang]}</p>
              
              <div className="mt-auto pt-8 border-t border-slate-50 flex gap-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white font-black py-5 rounded-[1.5rem] shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 group/btn btn-premium"
                >
                  <span className="text-xs uppercase tracking-widest">{t('add_to_cart')}</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">🛒</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Added missing default export
export default ProductGrid;
