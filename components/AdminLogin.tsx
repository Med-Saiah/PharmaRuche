
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: (key: string) => string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={handleClose}></div>
      <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl space-y-6 animate-in zoom-in-95">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#d97706] to-amber-600 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg">
             🔐
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">{t('admin_panel')}</h2>
          <p className="text-zinc-500 text-sm mt-2 font-semibold uppercase tracking-widest">Secure Access Required</p>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-700 px-1">📧 Email</label>
          <input 
            type="email" 
            autoFocus
            required
            className="w-full px-6 py-3 rounded-xl border-2 font-semibold placeholder-zinc-400 outline-none transition-all duration-300 border-zinc-200 bg-zinc-50 focus:border-[#d97706] focus:bg-white focus:ring-2 focus:ring-amber-200"
            placeholder="admin@pharmaruche.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-700 px-1">🔑 {t('password')}</label>
          <input 
            type="password"
            required
            className={`w-full px-6 py-3 rounded-xl border-2 font-semibold text-center tracking-widest placeholder-zinc-400 outline-none transition-all duration-300 ${error ? 'border-red-400 bg-red-50 animate-shake focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-zinc-200 bg-zinc-50 focus:border-[#d97706] focus:bg-white focus:ring-2 focus:ring-amber-200'}`}
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 animate-in slide-in-from-top-2">
            <p className="text-red-600 text-sm font-semibold flex items-center gap-2">
              ❌ {error}
            </p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#d97706] to-amber-600 hover:from-[#c27105] hover:to-amber-700 text-white font-black py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>{t('login')}</span>
              <span className="text-xl">🚀</span>
            </>
          )}
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
