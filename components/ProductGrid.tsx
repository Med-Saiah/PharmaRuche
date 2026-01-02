
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
    <div className="space-y-14 md:space-y-20">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setFilter(c)}
            className={`px-8 py-2.5 rounded-lg font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 ${filter === c ? 'bg-[#15803d] text-white shadow-lg shadow-green-600/30' : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-[#15803d] hover:text-[#15803d] hover:shadow-md'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-slate-100 group flex flex-col">
            <div className="relative h-72 overflow-hidden cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100" onClick={() => onSelectProduct(product)}>
              <img 
                src={product.image} 
                alt={product.name[lang]} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] shadow-lg border border-red-400/30">
                ✨ 100% NATURAL
              </div>
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-xl text-[#15803d] font-bold text-lg shadow-xl">
                {product.price} {t('currency')}
              </div>
            </div>
            
            <div className="p-8 md:p-10 flex-1 flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f59e0b] mb-2.5">{product.category}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#15803d] transition-colors leading-snug">{product.name[lang]}</h3>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed opacity-85 line-clamp-2">{product.description[lang]}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 group/btn"
                >
                  <span className="text-xs uppercase tracking-widest">{t('add_to_cart')}</span>
                  <span className="text-lg group-hover/btn:translate-x-1 transition-transform">🛒</span>
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
