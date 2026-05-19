import { useState } from 'react';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import bgLight from '../assets/bg-light.png';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const syncUserToSupabase = async (user: User, displayName?: string) => {
    try {
      await supabase.from('profiles').upsert({
        id: user.uid,
        name: displayName || user.displayName || 'User',
        avatar_url: user.photoURL || null,
        email: user.email || ''
      }, { onConflict: 'id' });
    } catch (err) {
      console.error('Error syncing user to Supabase:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        await syncUserToSupabase(user);
      } else {
        // Create user
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile with name
        await updateProfile(user, { displayName: name });
        await syncUserToSupabase(user, name);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await syncUserToSupabase(user);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundImage: `url(${bgLight})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-[#0f0d1a]/80 backdrop-blur-[2px] transition-colors duration-500"></div>

      <div className="glass-form w-full max-w-md p-8 relative z-10 animate-slide-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl mx-auto mb-4 border border-white/50" style={{ background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)' }}>
            M
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{isLogin ? 'Sign in to manage your expenses.' : 'Sign up to get started.'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-[#0EA5E9] mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full px-4 py-3 bg-white dark:bg-white/5 text-slate-800 dark:text-white rounded-xl border-[1.5px] border-[rgba(14,165,233,0.2)] focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] focus:-translate-y-[1px] outline-none transition-all duration-200"
                placeholder="Rohit Kumar"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#0EA5E9] mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 text-slate-800 dark:text-white rounded-xl border-[1.5px] border-[rgba(14,165,233,0.2)] focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] focus:-translate-y-[1px] outline-none transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0EA5E9] mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 text-slate-800 dark:text-white rounded-xl border-[1.5px] border-[rgba(14,165,233,0.2)] focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] focus:-translate-y-[1px] outline-none transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)' }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
          <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {/* Google SVG icon */}
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M47.532 24.552c0-1.636-.142-3.2-.406-4.701H24.48v9.19h13.02c-.576 2.99-2.26 5.522-4.792 7.22v5.998h7.752c4.536-4.18 7.072-10.34 7.072-17.707z" fill="#4285F4"/>
            <path d="M24.48 48c6.48 0 11.916-2.148 15.888-5.82l-7.752-5.998c-2.148 1.44-4.896 2.292-8.136 2.292-6.252 0-11.544-4.224-13.44-9.9H2.988v6.192C6.948 42.948 15.12 48 24.48 48z" fill="#34A853"/>
            <path d="M11.04 28.574a14.44 14.44 0 0 1-.756-4.574c0-1.584.276-3.12.756-4.574v-6.192H2.988A23.94 23.94 0 0 0 .48 24c0 3.876.924 7.548 2.508 10.766l8.052-6.192z" fill="#FBBC05"/>
            <path d="M24.48 9.552c3.516 0 6.672 1.212 9.156 3.588l6.864-6.864C36.384 2.376 30.948 0 24.48 0 15.12 0 6.948 5.052 2.988 13.234l8.052 6.192c1.896-5.676 7.188-9.874 13.44-9.874z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="font-semibold text-[#0EA5E9] hover:text-[#3B82F6] transition-colors ml-1"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
