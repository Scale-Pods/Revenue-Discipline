import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';
import { LogIn, Mail, Lock, Loader } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-brand-primary/30">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative group">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl group-hover:bg-brand-primary/30 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

          <div className="relative z-10 text-center mb-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-primary/20 shadow-inner">
              <LogIn className="text-brand-primary" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Sales Tracker</h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Command Center Access</p>
          </div>

          <div className="space-y-4">


            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl h-12 pl-12 pr-4 text-white font-bold outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-600"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl h-12 pl-12 pr-4 text-white font-bold outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-slate-900 h-12 rounded-xl font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Grant Access' : 'Create Account')}
              </button>
            </form>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              {isLogin ? "Need a new account? Register" : "Already have access? Login"}
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
          Secure Terminal v2.4.0
        </p>
      </div>
    </div>
  );
};

export default Login;
