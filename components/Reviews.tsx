
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
    <section id="reviews" className="py-20 md:py-32 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-8 bg-[#d97706] rounded"></div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d97706]">{t('feedback')}</p>
            <div className="h-1 w-8 bg-[#d97706] rounded"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">⭐ {t('reviews')}</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto leading-relaxed text-lg">
            {lang === 'ar'
              ? 'قصص حقيقية من عملائنا الراضين بعد كل عملية شراء'
              : 'Real stories from our satisfied customers after each purchase'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visible.map((r, i) => (
            <article key={`${r.name}-${i}`} className="bg-gradient-to-br from-white to-amber-50/50 p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-amber-100/70 h-full flex flex-col group">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="font-bold text-lg text-zinc-900 group-hover:text-[#d97706] transition-colors">{r.name}</div>
                  <div className="flex gap-0.5 text-amber-500 text-lg mt-1">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx} className="drop-shadow-sm">{idx < r.stars ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-zinc-700 leading-relaxed flex-1 italic text-base">
                &quot;{r.text}&quot;
              </p>
              <div className="flex gap-2 mt-6 pt-6 border-t border-amber-100/50">
                <div className="w-8 h-8 rounded-full bg-[#d97706]/10 flex items-center justify-center text-[#d97706] text-sm font-bold">✓</div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Verified Customer</p>
              </div>
            </article>
          ))}
        </div>

        {merged.length > 3 && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => setVisibleCount(canShowMore ? visibleCount + 3 : 3)}
              className="px-10 py-3 rounded-lg border-2 border-[#d97706] text-[#d97706] font-bold uppercase tracking-[0.2em] hover:bg-[#d97706] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              {canShowMore ? `${t('show_more')} →` : `← ${t('show_less')}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
