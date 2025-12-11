import { TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react';

interface DailySummaryProps {
  totalRevenue: number;
  totalTips: number;
  customerCount: number;
  unpaidCount: number;
}

export default function DailySummary({ totalRevenue, totalTips, customerCount, unpaidCount }: DailySummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
          <TrendingUp size={20} className="opacity-80" />
        </div>
        <p className="text-3xl font-bold">{totalRevenue.toFixed(2)} MAD</p>
        <p className="text-xs opacity-80 mt-1">Paid transactions only</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Total Tips</h3>
          <DollarSign size={20} className="opacity-80" />
        </div>
        <p className="text-3xl font-bold">{totalTips.toFixed(2)} MAD</p>
        <p className="text-xs opacity-80 mt-1">From paid orders</p>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Customers Today</h3>
          <Users size={20} className="opacity-80" />
        </div>
        <p className="text-3xl font-bold">{customerCount}</p>
        <p className="text-xs opacity-80 mt-1">Total transactions</p>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Unpaid</h3>
          <AlertCircle size={20} className="opacity-80" />
        </div>
        <p className="text-3xl font-bold">{unpaidCount}</p>
        <p className="text-xs opacity-80 mt-1">Outstanding credits</p>
      </div>
    </div>
  );
}
