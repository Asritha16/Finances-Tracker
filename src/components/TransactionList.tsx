
import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Calendar, Filter } from 'lucide-react';
import { Transaction } from '../types/Transaction';

interface TransactionListProps {
  transactions: Transaction[];
  isPreview?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, isPreview = false }) => {
  const [filter, setFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter === 'all' || transaction.type === filter;
    const accountMatch = accountFilter === 'all' || transaction.account === accountFilter;
    return typeMatch && accountMatch;
  });

  const displayTransactions = isPreview ? filteredTransactions : filteredTransactions;

  if (displayTransactions.length === 0 && !isPreview) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar className="mx-auto mb-4 opacity-50" size={48} />
        <p>No transactions found with current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isPreview && (
        <div className="flex gap-3 mb-4">
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
            <option value="account1">Account 1</option>
            <option value="account2">Account 2</option>
          </select>
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
                    {transaction.account === 'account1' ? 'Account 1' : 'Account 2'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`text-right font-bold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="text-lg">
                {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
