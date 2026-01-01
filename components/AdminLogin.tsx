
import React, { useState } from 'react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: (key: string) => string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess, t }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setPass('');
    setError(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123') {
      onSuccess();
      setPass('');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in" onClick={handleClose}></div>
      <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl space-y-8 animate-in zoom-in-95">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
             🔐
          </div>
          <h2 className="text-3xl font-black text-slate-900">{t('admin_panel')}</h2>
          <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">Restricted Access</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{t('password')}</label>
          <input 
            type="password" 
            autoFocus
            className={`w-full p-5 rounded-2xl border-2 outline-none transition-all font-bold text-center tracking-widest ${error ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-100 bg-slate-50 focus:border-amber-500 focus:bg-white'}`}
            placeholder="••••••••"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(false); }}
          />
        </div>
        
        {error && <p className="text-red-500 text-xs text-center font-black animate-in slide-in-from-top-1">Invalid credentials. Please try again.</p>}

        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3">
          <span>{t('login')}</span>
          <span className="text-xl">🚀</span>
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
