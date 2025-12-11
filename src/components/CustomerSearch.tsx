import { useState } from 'react';
import { Search, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { supabase, Transaction } from '../lib/supabase';

export default function CustomerSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .ilike('customer_name', `%${searchQuery.trim()}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const sortedData = (data || []).sort((a, b) => {
        if (a.is_paid === b.is_paid) return 0;
        return a.is_paid ? 1 : -1;
      });

      setSearchResults(sortedData);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const unpaidTransactions = searchResults.filter((t) => !t.is_paid);
  const totalUnpaid = unpaidTransactions.reduce((sum, t) => sum + t.amount, 0);

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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Search</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Search by customer name..."
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="w-full mt-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {hasSearched && (
        <>
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No customers found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <>
              {unpaidTransactions.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">Outstanding Balance</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{totalUnpaid.toFixed(2)} MAD</p>
                  <p className="text-sm text-red-600 mt-1">{unpaidTransactions.length} unpaid transaction(s)</p>
                </div>
              )}

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {searchResults.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-4 rounded-lg border-2 ${
                      transaction.is_paid
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.is_paid ? 'bg-emerald-100' : 'bg-red-100'}`}>
                          {transaction.is_paid ? (
                            <CheckCircle className="text-emerald-600" size={18} />
                          ) : (
                            <XCircle className="text-red-600" size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{transaction.customer_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className={`font-bold ${transaction.is_paid ? 'text-gray-800' : 'text-red-600'}`}>
                            {transaction.amount.toFixed(2)} MAD
                          </p>
                          {transaction.tip > 0 && (
                            <p className="text-xs text-emerald-600">+{transaction.tip.toFixed(2)} MAD tip</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleTogglePaidStatus(transaction.id, transaction.is_paid)}
                          className={`p-2 rounded-lg transition-colors text-white flex-shrink-0 ${
                            transaction.is_paid
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                          title={transaction.is_paid ? 'Mark as unpaid' : 'Mark as paid'}
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        transaction.is_paid
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.is_paid ? 'PAID' : 'UNPAID'}
                      </span>
                      <span className="text-gray-500">
                        {new Date(transaction.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
