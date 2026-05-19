import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { GroupCard } from './components/GroupCard';
import { AddExpenseForm } from './components/AddExpenseForm';
import { SummaryModal } from './components/SummaryModal';
import { UserProfile } from './components/UserProfile';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthScreen } from './components/AuthScreen';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Trophy, Activity, Camera } from 'lucide-react';
import bgDark from './assets/bg-dark.png';
import bgLight from './assets/bg-light.png';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<{name: string, amount: number}[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('description, amount')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formatted = data.map(e => ({ name: e.description, amount: Number(e.amount) }));
        setExpenses(formatted);
        setTotalAmount(formatted.reduce((acc, curr) => acc + curr.amount, 0));
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    // Failsafe: if Firebase doesn't respond within 5s, clear loading
    const timeout = setTimeout(() => setLoadingAuth(false), 5000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeout);
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  if (loadingAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${bgLight})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        <div className="relative flex flex-col items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl border border-white/50 animate-pulse" style={{ background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)' }}>M</div>
          <p className="text-slate-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div
      className="min-h-screen font-sans text-slate-800 dark:text-slate-100 overflow-hidden relative selection:bg-[#0EA5E9] selection:text-white transition-colors duration-500"
      style={{
        backgroundImage: `url(${bgLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Theme overlay */}
      <div className="absolute inset-0 bg-white/50 dark:bg-[#0f0d1a]/80 transition-colors duration-500 pointer-events-none"
        style={{ backgroundImage: `url(${bgDark})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0EA5E9] blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#F43F5E] blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#1a1630]/60 backdrop-blur-md transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl border border-white/50"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)' }}
            >
              M
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">Expenses App</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your group expenses with 3D precision.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-3.5 rounded-2xl font-semibold text-white overflow-hidden transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 8px 24px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 text-white">View Summary</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Groups */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your Groups</h3>
              <button className="text-sm font-semibold text-[#0EA5E9] hover:text-[#3B82F6] dark:text-[#7F77DD] dark:hover:text-white transition-colors">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GroupCard 
                groupName="CSK Cricket Team" 
                summary="Tournament entry & kits" 
                memberCount={16}
                accentColor="#F59E0B"
                icon={<Trophy size={28} strokeWidth={1.5} />} 
              />
              <GroupCard 
                groupName="Weekend Hikers" 
                summary="Travel & accommodation" 
                memberCount={8}
                accentColor="#10B981"
                icon={<Activity size={28} strokeWidth={1.5} />} 
              />
              <GroupCard 
                groupName="Photography Club" 
                summary="Studio rental fees" 
                memberCount={12}
                accentColor="#EC4899"
                icon={<Camera size={28} strokeWidth={1.5} />} 
              />
            </div>
          </div>

          {/* Right Column: Add Expense Form */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <AddExpenseForm onExpenseAdded={fetchExpenses} />
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <SummaryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        expenses={expenses}
        total={totalAmount}
      />
    </div>
  );
}

export default App;
