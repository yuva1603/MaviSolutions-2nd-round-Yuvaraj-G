import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, LogOut } from 'lucide-react';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

export function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setProfile({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar_url: firebaseUser.photoURL || null
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div 
        className="flex items-center gap-3 px-3 py-2 pr-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          boxShadow: '0 12px 40px rgba(14,165,233,0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.8)'
        }}
      >
        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 rounded bg-slate-200 animate-pulse"></div>
          <div className="w-16 h-2 rounded bg-slate-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div 
      className="flex items-center gap-4 px-3 py-2.5 pr-6 cursor-pointer hover:brightness-105 transition-all"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
        boxShadow: '0 12px 40px rgba(14,165,233,0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.8)'
      }}
    >
      <div 
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 animate-avatar-glow"
        style={{ background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)' }}
      >
        {profile?.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.name} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-[17px] tracking-wide">{initials}</span>
        )}
      </div>
      
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{profile?.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">{profile?.email}</span>
        </div>
      </div>
      
      <button 
        onClick={handleSignOut}
        className="ml-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-red-500 transition-colors"
        title="Sign Out"
      >
        <LogOut size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
