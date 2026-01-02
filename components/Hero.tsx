
import React from 'react';

interface HeroProps {
  t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ t }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&q=90&w=2000"
          alt="Honey Background"
          className="w-full h-full object-cover brightness-[0.55]"
        />
        {/* Warm Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
      </div>

      <div className="relative z-10 px-6 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center text-white">
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <img src="/brand-logo.svg" alt="Pharma Ruche" className="w-40 drop-shadow-lg" />
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-200 font-black">Direct du Producteur</p>
              <p className="text-sm text-amber-100 font-semibold">مناحل أسامة الصغير</p>
            </div>
          </div>

          <div className="inline-block px-5 py-2 rounded-full border border-amber-200/30 bg-white/10 backdrop-blur-md text-amber-100 font-black text-xs uppercase tracking-[0.3em] animate-fade-in-down">
            ✨ {t('tagline')}
          </div>

          <h2 className="text-5xl md:text-7xl font-black leading-[1.05] drop-shadow-xl animate-fade-in font-cairo">
            {t('hero_title')}
          </h2>

          <p className="text-lg md:text-2xl text-amber-50 font-medium drop-shadow-md leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up">
            <a
              href="#products"
              className="w-full sm:w-auto bg-[#d97706] hover:bg-[#b45309] text-white font-black py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              {t('products')}
            </a>
            <a
              href="#about"
              className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-black py-4 px-10 rounded-full transition-all flex items-center justify-center text-sm uppercase tracking-widest border border-white/20"
            >
              {t('about_us')}
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-end">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] p-6 shadow-2xl w-[360px] space-y-4">
            <div className="h-64 rounded-[22px] overflow-hidden shadow-xl ring-4 ring-amber-200/40">
              <img
                src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=900"
                alt="Pharma Ruche honey jars"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-amber-100 font-black text-lg">100% Natural</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">Eucalyptus · Sidr</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
