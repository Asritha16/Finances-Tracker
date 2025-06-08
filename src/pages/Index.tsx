
import React, { useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import { Transaction } from '../types/Transaction';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setShowForm(false);
  };

  const calculateBalance = (accountType: 'account1' | 'account2') => {
    return transactions
      .filter(t => t.account === accountType)
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  };

  const account1Balance = calculateBalance('account1');
  const account2Balance = calculateBalance('account2');
  const totalBalance = account1Balance + account2Balance;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Wallet className="text-blue-600" size={36} />
            Personal Finance Tracker
          </h1>
          <p className="text-gray-600 text-lg">Take control of your expenses across multiple accounts</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceCard
            title="Account 1"
            balance={account1Balance}
            icon={<Wallet className="text-blue-600" size={24} />}
            gradient="from-blue-500 to-blue-600"
          />
          <BalanceCard
            title="Account 2"
            balance={account2Balance}
            icon={<Wallet className="text-green-600" size={24} />}
            gradient="from-green-500 to-green-600"
          />
          <BalanceCard
            title="Total Balance"
            balance={totalBalance}
            icon={totalBalance >= 0 ? <TrendingUp className="text-purple-600" size={24} /> : <TrendingDown className="text-red-600" size={24} />}
            gradient="from-purple-500 to-purple-600"
            isTotal
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus size={20} />
            Add New Transaction
          </button>
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* Recent Transactions & Full List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
            {recentTransactions.length > 0 ? (
              <TransactionList transactions={recentTransactions} isPreview />
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Wallet className="mx-auto mb-4 opacity-50" size={48} />
                <p>No transactions yet. Add your first transaction to get started!</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Transactions</h2>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
