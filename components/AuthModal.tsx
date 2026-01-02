
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'Producer' | 'Operator' | 'VIP Client'>('VIP Client');
  const [email, setEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[language];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col relative">
        
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700"></div>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-600 rounded-full transition-all z-10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-3xl mb-4">
                <i className="fa-solid fa-check"></i>
             </div>
             <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tighter">Success</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Welcome to the inner circle.</p>
          </div>
        ) : (
          <div className="p-8">
            <div className="text-center mb-10">
              <div className="inline-block bg-amber-600 p-3 rounded-2xl mb-4 shadow-lg shadow-amber-600/20">
                <i className="fa-solid fa-crown text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                {isLogin ? t.login : t.join}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                {t.subtitle}
              </p>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t.login}
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${!isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t.join}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.role}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Producer', 'Operator', 'VIP Client'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 text-[9px] font-black uppercase rounded-lg border transition-all ${role === r ? 'bg-amber-600 text-white border-amber-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-amber-500'}`}
                      >
                        {r === 'Producer' ? t.producer : r === 'Operator' ? t.operator : t.vipClient}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{t.email}</label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {!isLogin && (role === 'Producer' || role === 'Operator') && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{t.brandName}</label>
                  <div className="relative">
                    <i className="fa-solid fa-building absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Organization Ltd."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{t.password}</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                  />
                </div>
                {isLogin && (
                  <button type="button" className="text-[10px] font-black uppercase text-amber-600 hover:text-amber-700 mt-2 tracking-widest">
                    {t.forgotPassword}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 dark:bg-amber-600 text-white font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 dark:hover:bg-amber-500 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 text-xs"
              >
                {isSubmitting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-shield-halved"></i>}
                {isSubmitting ? 'Verifying...' : (isLogin ? t.login : t.join)}
              </button>

              <div className="text-center pt-4">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   {isLogin ? t.noAccount : t.hasAccount}{' '}
                   <button 
                     type="button" 
                     onClick={() => setIsLogin(!isLogin)}
                     className="text-amber-600 hover:text-amber-700"
                   >
                     {isLogin ? t.join : t.login}
                   </button>
                 </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
