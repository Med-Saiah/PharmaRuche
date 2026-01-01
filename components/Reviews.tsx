
import React from 'react';

interface ReviewsProps {
  t: (key: string) => string;
}

const Reviews: React.FC<ReviewsProps> = ({ t }) => {
  const reviews = [
    { name: 'محمد ب.', text: 'أفضل عسل سدر جربته في الجزائر، الجودة رائعة والتوصيل سريع.', stars: 5 },
    { name: 'Sarah L.', text: 'The royal jelly is very fresh and packaging is very professional. Highly recommended.', stars: 5 },
    { name: 'أحمد م.', text: 'تعامل راقي جداً والمنتجات طبيعية 100%. شكراً لكم.', stars: 4 },
  ];

  return (
    <section id="reviews" className="py-20 px-4 md:px-8 bg-amber-600 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{t('reviews')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className={idx < r.stars ? 'text-amber-400' : 'text-slate-400'}>★</span>
                ))}
              </div>
              <p className="italic mb-6 opacity-90 leading-relaxed">"{r.text}"</p>
              <p className="font-bold">- {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
