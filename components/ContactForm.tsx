
import React, { useState } from 'react';
import { Language } from '../types';

interface ContactFormProps {
  t: (key: string) => string;
  lang: Language;
}

const ContactForm: React.FC<ContactFormProps> = ({ t, lang }) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{t('full_name')}</label>
        <input 
          type="text" 
          required 
          className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-all font-bold" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email</label>
        <input 
          type="email" 
          required 
          className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-all font-bold" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Message</label>
        <textarea 
          required 
          rows={3} 
          className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-all font-bold resize-none"
        ></textarea>
      </div>
      
      {sent ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold animate-in fade-in">
          {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Message sent successfully!'}
        </div>
      ) : (
        <button type="submit" className="w-full bg-[#d97706] hover:bg-zinc-900 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs mt-2">
           {lang === 'ar' ? 'إرسال' : 'Send'}
        </button>
      )}
    </form>
  );
};

export default ContactForm;
