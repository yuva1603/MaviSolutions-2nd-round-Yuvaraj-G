import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check } from 'lucide-react';

interface AddExpenseFormProps {
  onExpenseAdded?: () => void;
}

export function AddExpenseForm({ onExpenseAdded }: AddExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  
  const [errors, setErrors] = useState<{ amount?: string; description?: string; date?: string }>({});
  const [shakeField, setShakeField] = useState<{ amount?: boolean; description?: boolean; date?: boolean }>({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate on change
  useEffect(() => {
    validate(amount, description, date, false);
  }, [amount, description, date]);

  const validate = (amt: string, desc: string, dt: string, triggerShake: boolean = false) => {
    const newErrors: typeof errors = {};
    const newShakes: typeof shakeField = {};
    let valid = true;

    const amountNum = parseFloat(amt);
    if (!amt || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Valid amount > 0 is required';
      if (triggerShake && !errors.amount) newShakes.amount = true;
      valid = false;
    }

    if (!desc || desc.trim().length === 0) {
      newErrors.description = 'Description cannot be empty';
      if (triggerShake && !errors.description) newShakes.description = true;
      valid = false;
    }

    if (!dt) {
      newErrors.date = 'Date must be selected';
      if (triggerShake && !errors.date) newShakes.date = true;
      valid = false;
    }

    setErrors(newErrors);
    if (triggerShake) setShakeField(newShakes);
    setIsValid(valid);
    
    // Clear shakes after animation
    if (triggerShake && Object.keys(newShakes).length > 0) {
      setTimeout(() => setShakeField({}), 400);
    }
    
    return valid;
  };

  const handleFieldChange = (field: 'amount' | 'description' | 'date', value: string) => {
    if (field === 'amount') setAmount(value);
    if (field === 'description') setDescription(value);
    if (field === 'date') setDate(value);
  };

  const handleSubmit = async () => {
    if (validate(amount, description, date, true)) {
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('expenses')
          .insert([{ amount: parseFloat(amount), description, date }]);

        if (error) throw error;

        // Reset form
        setAmount('');
        setDescription('');
        setDate('');
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Notify parent
        if (onExpenseAdded) onExpenseAdded();
      } catch (error) {
        console.error('Error inserting expense:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getInputClass = (field: 'amount' | 'description' | 'date') => {
    const baseClass = "w-full px-4 py-3 bg-white dark:bg-white/5 text-slate-800 dark:text-white rounded-xl outline-none transition-all duration-200";
    const borderStyle = "border-[1.5px]";
    const restBorder = "border-[rgba(14,165,233,0.2)]";
    const focusStyle = "focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] focus:-translate-y-[1px]";
    const errorBorder = "border-[#E24B4A]";
    
    let combined = `${baseClass} ${borderStyle} ${errors[field] ? errorBorder : restBorder} ${focusStyle}`;
    if (shakeField[field]) combined += " animate-error-shake";
    
    return combined;
  };

  return (
    <div className="glass-form animate-slide-in p-6 w-full max-w-md mx-auto relative overflow-hidden">
      {showSuccess && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-[#1a1630]/90 backdrop-blur-sm animate-modal-pop">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
            <Check size={32} className="text-emerald-500" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Thank You!</h3>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-center px-4">Expense added successfully.</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 drop-shadow-sm tracking-tight">Add Expense</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#0EA5E9] mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => handleFieldChange('amount', e.target.value)}
              className={`${getInputClass('amount')} pl-8`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="text-[#E24B4A] text-xs font-medium mt-1.5">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0EA5E9] mb-1.5">Description</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className={getInputClass('description')}
            placeholder="e.g. Flight tickets"
          />
          {errors.description && <p className="text-[#E24B4A] text-xs font-medium mt-1.5">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0EA5E9] mb-1.5">Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            className={`${getInputClass('date')} text-slate-600 dark:text-slate-200`}
          />
          {errors.date && <p className="text-[#E24B4A] text-xs font-medium mt-1.5">{errors.date}</p>}
        </div>

        <div 
          onClick={(isValid && !isSubmitting) ? handleSubmit : undefined}
          className={`
            mt-8 w-full py-3.5 rounded-xl text-white font-semibold text-center select-none transition-all duration-300
            ${(isValid && !isSubmitting) 
              ? 'cursor-pointer hover:-translate-y-1 active:scale-[0.98] animate-pulse-3d shadow-lg' 
              : 'opacity-50 cursor-not-allowed pointer-events-none'
            }
          `}
          style={{ background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Expense'}
        </div>
      </div>
    </div>
  );
}
