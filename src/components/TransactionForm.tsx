import { useState } from 'react';
import { User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [tip, setTip] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !amount) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            customer_name: customerName.trim(),
            amount: parseFloat(amount),
            tip: tip ? parseFloat(tip) : 0,
            is_paid: isPaid,
          },
        ]);

      if (error) throw error;

      setCustomerName('');
      setAmount('');
      setTip('');
      setIsPaid(true);
      onTransactionAdded();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">New Transaction</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter customer name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold text-sm">MAD</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="tip" className="block text-sm font-medium text-gray-700 mb-2">
              Tip (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold text-sm">MAD</span>
              <input
                type="number"
                id="tip"
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <span className="text-sm font-medium text-gray-700">Payment Status</span>
          <button
            type="button"
            onClick={() => setIsPaid(!isPaid)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              isPaid ? 'bg-emerald-500' : 'bg-red-400'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                isPaid ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPaid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {isSubmitting ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}
