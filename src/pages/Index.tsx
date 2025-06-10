import React, { useState, useEffect } from 'react';
import { Plus, Wallet } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import DataControls from '../components/DataControls';
import { Transaction } from '../types/Transaction';
import { saveTransactionsToStorage, loadTransactionsFromStorage } from '../utils/dataStorage';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = loadTransactionsFromStorage();
    setTransactions(savedTransactions);
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setShowForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const handleImportTransactions = (importedTransactions: Transaction[]) => {
    setTransactions(importedTransactions);
  };

  const calculateBalance = (accountType: 'account1' | 'account2') => {
    return transactions
      .filter(t => t.account === accountType)
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  };

  const account1Balance = calculateBalance('account1');
  const account2Balance = calculateBalance('account2');

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-3xl shadow-2xl">
              <Wallet className="text-white" size={40} />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                FinanceTracker Pro
              </h1>
              <p className="text-slate-600 text-lg font-medium">Professional Financial Management Suite</p>
            </div>
          </div>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Secure, local financial tracking with advanced analytics and Excel integration
          </p>
        </div>

        {/* Enhanced Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          <BalanceCard
            title="Primary Account"
            balance={account1Balance}
            icon={<Wallet className="text-white" size={28} />}
            gradient="from-blue-600 to-indigo-700"
          />
          <BalanceCard
            title="Secondary Account"
            balance={account2Balance}
            icon={<Wallet className="text-white" size={28} />}
            gradient="from-emerald-600 to-green-700"
          />
          <BalanceCard
            title="Total Balance"
            balance={account1Balance + account2Balance}
            icon={<Wallet className="text-white" size={28} />}
            gradient="from-purple-600 to-pink-700"
            isTotal={true}
          />
        </div>

        {/* Data Management with Professional Styling */}
        <DataControls 
          transactions={transactions} 
          onImportTransactions={handleImportTransactions}
        />

        {/* Professional Action Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white px-12 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={24} />
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

        {/* Enhanced Transaction Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Recent Activity
            </h2>
            {recentTransactions.length > 0 ? (
              <TransactionList transactions={recentTransactions} isPreview />
            ) : (
              <div className="text-center text-slate-500 py-12">
                <Wallet className="mx-auto mb-6 opacity-30" size={64} />
                <p className="text-xl font-medium">No transactions yet</p>
                <p className="text-slate-400">Add your first transaction to get started</p>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-3 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
              All Transactions
            </h2>
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={deleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
