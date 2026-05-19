import type { ReactNode } from 'react';

interface GroupCardProps {
  groupName: string;
  icon: ReactNode | string;
  summary: string;
  memberCount: number;
  accentColor: string;
}

export function GroupCard({ groupName, icon, summary, memberCount, accentColor }: GroupCardProps) {
  return (
    <div className="preserve-3d perspective-1200">
      <div 
        className="glass-card glare-overlay animate-float rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4 cursor-pointer"
        style={{ '--card-accent': accentColor } as React.CSSProperties}
      >
        <div className="flex items-center justify-between">
          <div className="glass-orb w-14 h-14 flex items-center justify-center shrink-0" style={{ color: accentColor }}>
            {typeof icon === 'string' ? <span className="text-2xl">{icon}</span> : icon}
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10">
            <div className="w-2 h-2 rounded-full animate-badge-pulse" style={{ backgroundColor: accentColor }}></div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{memberCount} members</span>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-1.5 tracking-tight">{groupName}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{summary}</p>
        </div>
      </div>
    </div>
  );
}
