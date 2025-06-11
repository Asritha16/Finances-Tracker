
import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Calendar, Trash2, Edit, Filter } from 'lucide-react';
import { Transaction } from '../types/Transaction';

interface TransactionListProps {
  transactions: Transaction[];
  isPreview?: boolean;
  onDeleteTransaction?: (id: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  isPreview = false, 
  onDeleteTransaction,
  onEditTransaction 
}) => {
  const [filter, setFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories from transactions
  const categories = Array.from(new Set(
    transactions
      .map(t => t.category)
      .filter(Boolean)
  )).sort();

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter === 'all' || transaction.type === filter;
    const accountMatch = accountFilter === 'all' || transaction.account === accountFilter;
    const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
    const searchMatch = searchTerm === '' || 
      transaction.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return typeMatch && accountMatch && categoryMatch && searchMatch;
  });

  const displayTransactions = isPreview ? filteredTransactions.slice(0, 5) : filteredTransactions;

  const handleDelete = (id: string) => {
    if (onDeleteTransaction && window.confirm('Are you sure you want to delete this transaction?')) {
      onDeleteTransaction(id);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    if (onEditTransaction) {
      onEditTransaction(transaction);
    }
  };

  if (displayTransactions.length === 0 && !isPreview) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar className="mx-auto mb-4 opacity-50" size={48} />
        <p>No transactions found with current filters.</p>
        {(filter !== 'all' || accountFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
          <button 
            onClick={() => {
              setFilter('all');
              setAccountFilter('all');
              setCategoryFilter('all');
              setSearchTerm('');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isPreview && (
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pl-8"
            />
            <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
            
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Accounts</option>
              <option value="account1">Personal Account</option>
              <option value="account2">Salary Account</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {(filter !== 'all' || accountFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setFilter('all');
                  setAccountFilter('all');
                  setCategoryFilter('all');
                  setSearchTerm('');
                }}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className={`space-y-3 ${!isPreview ? 'max-h-96 overflow-y-auto' : ''}`}>
        {displayTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpCircle size={20} />
                ) : (
                  <ArrowDownCircle size={20} />
                )}
              </div>
              
              <div>
                <p className="font-medium text-gray-800">{transaction.reason}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{transaction.date}</span>
                  <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                    {transaction.account === 'account1' ? 'Personal Account' : 'Salary Account'}
                  </span>
                  {transaction.category && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {transaction.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`text-right font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="text-lg">
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </span>
              </div>
              
              {!isPreview && (
                <div className="flex gap-1">
                  {onEditTransaction && (
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit transaction"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  
                  {onDeleteTransaction && (
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
