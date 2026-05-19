import type { ReactNode } from 'react';

interface GroupCardProps {
  groupName: string;
  icon: ReactNode | string;
  summary: string;
  memberCount: number;
  accentColor: string;
  members?: string[];
}

export function GroupCard({ 
  groupName, 
  icon, 
  summary, 
  memberCount, 
  accentColor,
  members = ['JD', 'AK', 'SR', 'MP'] // Mock default members
}: GroupCardProps) {
  const displayMembers = members.slice(0, 3);
  const remaining = memberCount - displayMembers.length;

  return (
    <div className="preserve-3d perspective-1200 h-full">
      <div 
        className="glass-card glare-overlay animate-float rounded-2xl p-6 relative overflow-hidden flex flex-col h-full cursor-pointer"
        style={{ '--card-accent': accentColor } as React.CSSProperties}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="glass-orb w-14 h-14 flex items-center justify-center shrink-0" style={{ color: accentColor }}>
            {typeof icon === 'string' ? <span className="text-2xl">{icon}</span> : icon}
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10">
            <div className="w-2 h-2 rounded-full animate-badge-pulse" style={{ backgroundColor: accentColor }}></div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{memberCount} members</span>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-1.5 tracking-tight">{groupName}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{summary}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between">
          <div className="flex -space-x-2">
            {displayMembers.map((initials, i) => (
              <div 
                key={i}
                className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1630] flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm"
                style={i === 0 ? { background: accentColor, color: 'white' } : { background: 'var(--tw-gradient-from)', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.4))' }}
              >
                {initials}
              </div>
            ))}
            {remaining > 0 && (
              <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1630] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 shadow-sm backdrop-blur-sm">
                +{remaining}
              </div>
            )}
          </div>
          
          <span 
            className="text-xs font-semibold hover:underline opacity-80 hover:opacity-100 transition-opacity" 
            style={{ color: accentColor }}
          >
            View Group
          </span>
        </div>
      </div>
    </div>
  );
}
