
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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? transaction : t)
      );
      setEditingTransaction(null);
    } else {
      // Add new transaction
      setTransactions(prev => [transaction, ...prev]);
    }
    setShowForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Wallet className="text-white" size={32} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                FinanceTracker Pro
              </h1>
              <p className="text-slate-600 text-sm font-medium">Professional Financial Management</p>
            </div>
          </div>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Secure, local financial tracking with Excel integration
          </p>
        </div>

        {/* Compact Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          <BalanceCard
            title="Personal Account"
            balance={account1Balance}
            icon={<Wallet className="text-white" size={20} />}
            gradient="from-blue-600 to-indigo-700"
          />
          <BalanceCard
            title="Salary Account"
            balance={account2Balance}
            icon={<Wallet className="text-white" size={20} />}
            gradient="from-emerald-600 to-green-700"
          />
          <BalanceCard
            title="Total Balance"
            balance={account1Balance + account2Balance}
            icon={<Wallet className="text-white" size={20} />}
            gradient="from-purple-600 to-pink-700"
            isTotal={true}
          />
        </div>

        {/* Compact Data Management */}
        <DataControls 
          transactions={transactions} 
          onImportTransactions={handleImportTransactions}
        />

        {/* Compact Action Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white px-8 py-3 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            Add New Transaction
          </button>
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={handleCloseForm}
            editTransaction={editingTransaction}
          />
        )}

        {/* Compact Transaction Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-5">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Recent Activity
            </h2>
            {recentTransactions.length > 0 ? (
              <TransactionList transactions={recentTransactions} isPreview />
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Wallet className="mx-auto mb-4 opacity-30" size={48} />
                <p className="text-lg font-medium">No transactions yet</p>
                <p className="text-slate-400 text-sm">Add your first transaction to get started</p>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-5">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
              All Transactions
            </h2>
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={deleteTransaction}
              onEditTransaction={editTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
