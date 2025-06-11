
import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, CreditCard, Tag } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { Transaction } from '../types/Transaction';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClose, editTransaction }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    reason: '',
    type: 'expense' as 'income' | 'expense',
    account: 'account1' as 'account1' | 'account2',
    category: ''
  });

  // Predefined categories based on your account management strategy
  const expenseCategories = [
    'Groceries & Food',
    'Transportation',
    'Entertainment & Dining',
    'Shopping & Personal Care',
    'Utilities',
    'Rent/EMI',
    'Insurance',
    'Medical & Emergency',
    'Paid for Others (Reimbursable)',
    'Loans Given',
    'Investment',
    'Other'
  ];

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investment Returns',
    'Interest',
    'Reimbursement Received',
    'Loan Repayment Received',
    'Gift/Bonus',
    'Other'
  ];

  // Populate form if editing
  useEffect(() => {
    if (editTransaction) {
      setFormData({
        date: editTransaction.date,
        amount: editTransaction.amount.toString(),
        reason: editTransaction.reason,
        type: editTransaction.type,
        account: editTransaction.account,
        category: editTransaction.category || ''
      });
    }
  }, [editTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    const transaction: Transaction = {
      id: editTransaction ? editTransaction.id : Date.now().toString(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      type: formData.type,
      account: formData.account,
      category: formData.category || undefined
    };

    onSubmit(transaction);
  };

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IndianRupee className="inline mr-2" size={16} />
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline mr-2" size={16} />
              Reason/Description
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="What was this transaction for?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense', category: '' }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="inline mr-2" size={16} />
                Account
              </label>
              <select
                value={formData.account}
                onChange={(e) => setFormData(prev => ({ ...prev, account: e.target.value as 'account1' | 'account2' }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="account1">Personal Account</option>
                <option value="account2">Salary Account</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline mr-2" size={16} />
              Category (Optional)
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Category</option>
              {currentCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
            >
              {editTransaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
