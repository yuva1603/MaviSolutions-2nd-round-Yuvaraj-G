import { X } from 'lucide-react';

interface ExpensesSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpensesSummaryModal({ isOpen, onClose }: ExpensesSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Total Expenses Summary</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-slate-600 font-medium">Flight Tickets</span>
              </div>
              <span className="font-semibold text-slate-800">$450.00</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600 font-medium">Hotel Accommodation</span>
              </div>
              <span className="font-semibold text-slate-800">$320.00</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-slate-600 font-medium">Food & Beverages</span>
              </div>
              <span className="font-semibold text-slate-800">$120.00</span>
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-slate-200 flex justify-between items-end">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Amount</span>
            <span className="text-3xl font-bold text-slate-900">$890.00</span>
          </div>
        </div>
        
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
          <button 
            className="px-5 py-2.5 rounded-xl font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            Confirm & Export
          </button>
        </div>
      </div>
    </div>
  );
}
