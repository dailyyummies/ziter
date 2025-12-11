import { useState } from 'react';
import { CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import { Transaction, supabase } from '../lib/supabase';

interface CustomerListProps {
  transactions: Transaction[];
  filter: 'all' | 'paid' | 'unpaid';
  onFilterChange: (filter: 'all' | 'paid' | 'unpaid') => void;
}

export default function CustomerList({ transactions, filter, onFilterChange }: CustomerListProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  let filteredTransactions = transactions.filter((t) => {
    if (filter === 'paid') return t.is_paid;
    if (filter === 'unpaid') return !t.is_paid;
    return true;
  });

  if (startDate || endDate) {
    filteredTransactions = filteredTransactions.filter((t) => {
      const transactionDateTime = new Date(t.created_at);

      if (startDate) {
        const startDateTime = new Date(startDate + (startTime ? `T${startTime}` : 'T00:00:00'));
        if (transactionDateTime < startDateTime) return false;
      }

      if (endDate) {
        const endDateTime = new Date(endDate + (endTime ? `T${endTime}` : 'T23:59:59'));
        if (transactionDateTime > endDateTime) return false;
      }

      return true;
    });
  }

  const filteredRevenue = filteredTransactions
    .filter((t) => filter === 'unpaid' ? !t.is_paid : t.is_paid)
    .reduce((sum, t) => sum + t.amount, 0);
  const filteredTips = filteredTransactions
    .filter((t) => filter === 'unpaid' ? !t.is_paid : t.is_paid)
    .reduce((sum, t) => sum + t.tip, 0);

  const handleTogglePaidStatus = async (transactionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ is_paid: !currentStatus })
        .eq('id', transactionId);

      if (error) throw error;

      window.location.reload();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setDeleteModalOpen(true);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (deletePassword !== '010203') {
      setDeleteError('Incorrect password');
      return;
    }

    if (!transactionToDelete) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionToDelete);

      if (error) throw error;

      setDeleteModalOpen(false);
      setDeletePassword('');
      setTransactionToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setDeleteError('Failed to delete transaction');
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeletePassword('');
    setDeleteError('');
    setTransactionToDelete(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Customers</h2>
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange('paid')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'paid'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => onFilterChange('unpaid')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'unpaid'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unpaid
            </button>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  placeholder="Optional time"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  placeholder="Optional time"
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setStartTime('');
                  setEndTime('');
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear date filters
              </button>
            )}
          </div>
        </div>
      </div>

      {(startDate || endDate) && filteredTransactions.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 border-2 ${
            filter === 'unpaid'
              ? 'bg-red-50 border-red-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <p className={`text-sm font-medium ${
              filter === 'unpaid' ? 'text-red-700' : 'text-emerald-700'
            }`}>
              {filter === 'unpaid' ? 'Unpaid Amount' : 'Revenue'}
            </p>
            <p className={`text-2xl font-bold ${
              filter === 'unpaid' ? 'text-red-600' : 'text-emerald-600'
            }`}>
              {filteredRevenue.toFixed(2)} MAD
            </p>
          </div>
          <div className={`rounded-lg p-4 border-2 ${
            filter === 'unpaid'
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm font-medium ${
              filter === 'unpaid' ? 'text-red-700' : 'text-blue-700'
            }`}>
              Tips
            </p>
            <p className={`text-2xl font-bold ${
              filter === 'unpaid' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {filteredTips.toFixed(2)} MAD
            </p>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No transactions found</p>
          <p className="text-sm mt-1">Add a new transaction to get started</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-full ${transaction.is_paid ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {transaction.is_paid ? (
                    <CheckCircle className="text-emerald-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{transaction.customer_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-gray-800">{transaction.amount.toFixed(2)} MAD</p>
                  {transaction.tip > 0 && (
                    <p className="text-sm text-emerald-600">+{transaction.tip.toFixed(2)} MAD tip</p>
                  )}
                </div>
                <button
                  onClick={() => handleTogglePaidStatus(transaction.id, transaction.is_paid)}
                  className={`p-2 rounded-lg transition-colors text-white ${
                    transaction.is_paid
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                  }`}
                  title={transaction.is_paid ? 'Mark as unpaid' : 'Mark as paid'}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(transaction.id)}
                  className="p-2 rounded-lg transition-colors text-white bg-gray-400 hover:bg-gray-500"
                  title="Delete transaction"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Enter the password to delete this transaction</p>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setDeleteError('');
              }}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all mb-2"
              onKeyPress={(e) => e.key === 'Enter' && handleConfirmDelete()}
            />

            {deleteError && (
              <p className="text-red-500 text-sm mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
