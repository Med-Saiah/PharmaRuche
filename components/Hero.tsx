
import React from 'react';

interface HeroProps {
  t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ t }) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&q=80&w=2000" 
          alt="Honey Background" 
          className="w-full h-full object-cover brightness-[0.7]"
        />
        {/* Warm Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-amber-900/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl text-white">
        <div className="inline-block px-6 py-2 rounded-full border border-amber-200/30 bg-white/10 backdrop-blur-md text-amber-100 font-bold text-xs uppercase tracking-[0.3em] mb-8 animate-fade-in-down">
          ✨ {t('tagline')}
        </div>
        
        <h2 className="text-5xl md:text-8xl font-black mb-6 leading-[1.1] drop-shadow-lg animate-fade-in font-cairo">
          {t('hero_title')}
        </h2>
        
        <p className="text-lg md:text-2xl mb-10 text-amber-50 font-medium drop-shadow-md max-w-2xl mx-auto leading-relaxed">
          {t('hero_subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up">
          <a 
            href="#products" 
            className="w-full sm:w-auto bg-[#d97706] hover:bg-[#b45309] text-white font-black py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
          >
            {t('products')}
          </a>
          <a 
            href="#about" 
            className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-zinc-900 font-black py-4 px-10 rounded-full transition-all flex items-center justify-center text-sm uppercase tracking-widest"
          >
            {t('about_us')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
