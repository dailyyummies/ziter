import { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';
import { supabase, Transaction } from './lib/supabase';
import TransactionForm from './components/TransactionForm';
import DailySummary from './components/DailySummary';
import CustomerList from './components/CustomerList';
import CustomerSearch from './components/CustomerSearch';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [loading, setLoading] = useState(true);

  const fetchTodayTransactions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('transaction_date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTransactions();
  }, []);

  const paidTransactions = transactions.filter((t) => t.is_paid);
  const totalRevenue = paidTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalTips = paidTransactions.reduce((sum, t) => sum + t.tip, 0);
  const unpaidCount = transactions.filter((t) => !t.is_paid).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg">
              <Coffee className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Café Waiter</h1>
              <p className="text-gray-600">Track your daily transactions</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="lg:hidden space-y-8">
              <TransactionForm onTransactionAdded={fetchTodayTransactions} />
              <CustomerSearch />
              <DailySummary
                totalRevenue={totalRevenue}
                totalTips={totalTips}
                customerCount={transactions.length}
                unpaidCount={unpaidCount}
              />
              <CustomerList
                transactions={transactions}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>

            <div className="hidden lg:block space-y-8">
              <DailySummary
                totalRevenue={totalRevenue}
                totalTips={totalTips}
                customerCount={transactions.length}
                unpaidCount={unpaidCount}
              />

              <div className="grid lg:grid-cols-2 gap-8">
                <TransactionForm onTransactionAdded={fetchTodayTransactions} />
                <CustomerSearch />
              </div>

              <CustomerList
                transactions={transactions}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
