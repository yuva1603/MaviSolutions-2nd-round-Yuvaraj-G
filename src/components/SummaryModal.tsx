import { X } from 'lucide-react';

interface ExpenseItem {
  name: string;
  amount: number;
}

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: ExpenseItem[];
  total: number;
}

export function SummaryModal({ isOpen, onClose, expenses, total }: SummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#0a081c]/75 backdrop-blur-sm"
    >
      <div 
        className="glass-modal animate-modal-pop rounded-2xl w-full max-w-lg overflow-hidden relative"
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Expenses Summary</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="space-y-1">
            {expenses.map((exp, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/5 last:border-0"
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium">{exp.name}</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">${exp.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 relative pt-6 flex justify-between items-end">
            {/* Divider Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)' }}
            />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white drop-shadow-sm">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="p-6 pt-2 flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
