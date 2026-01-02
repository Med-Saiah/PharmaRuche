
import React, { useMemo, useState } from 'react';
import { Feedback, Language } from '../types';

interface ReviewsProps {
  t: (key: string) => string;
  feedbacks: Feedback[];
  lang: Language;
}

const Reviews: React.FC<ReviewsProps> = ({ t, feedbacks, lang }) => {
  const seed = [
    { name: 'محمد ب.', text: 'أفضل عسل سدر جربته في الجزائر، الجودة رائعة والتوصيل سريع.', stars: 5 },
    { name: 'Sarah L.', text: 'The royal jelly is very fresh and packaging is very professional. Highly recommended.', stars: 5 },
    { name: 'أحمد م.', text: 'تعامل راقي جداً والمنتجات طبيعية 100%. شكراً لكم.', stars: 4 },
    { name: 'Rym A.', text: 'Packaging inspired by the hive, and the taste is exactly like fresh comb honey.', stars: 5 },
    { name: 'Khaled', text: 'خدمة عملاء ممتازة ومواعيد توصيل محترمة.', stars: 4 }
  ];

  const merged = useMemo(() => {
    const normalized = feedbacks.map(fb => ({ name: fb.customerName, text: fb.comment, stars: fb.rating }));
    return [...normalized, ...seed];
  }, [feedbacks]);

  const [visibleCount, setVisibleCount] = useState(3);
  const visible = merged.slice(0, visibleCount);
  const canShowMore = visibleCount < merged.length;

  return (
    <section id="reviews" className="py-20 px-4 md:px-8 bg-gradient-to-b from-amber-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">{t('feedback')}</p>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900">{t('reviews')}</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'قصص حقيقية من عملائنا بعد كل عملية شراء.'
              : 'Stories from customers after each delivery.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((r, i) => (
            <article key={`${r.name}-${i}`} className="bg-white p-7 rounded-2xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.2)] border border-amber-100/60 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="font-black text-lg text-zinc-900">{r.name}</div>
                <div className="flex gap-1 text-amber-500 text-sm">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx}>{idx < r.stars ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              <p className="text-zinc-600 leading-relaxed flex-1">“{r.text}”</p>
            </article>
          ))}
        </div>

        {merged.length > 3 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount(canShowMore ? visibleCount + 3 : 3)}
              className="px-6 py-3 rounded-full border-2 border-amber-500 text-amber-600 font-black uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all"
            >
              {canShowMore ? t('show_more') : t('show_less')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
