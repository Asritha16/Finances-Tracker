
import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, FileText, Tag, Building } from 'lucide-react';
import { Transaction } from '../types/Transaction';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onClose,
  editTransaction,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    reason: '',
    type: 'expense' as 'income' | 'expense',
    account: 'account1' as 'account1' | 'account2',
    category: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        date: editTransaction.date,
        amount: editTransaction.amount.toString(),
        reason: editTransaction.reason,
        type: editTransaction.type,
        account: editTransaction.account,
        category: editTransaction.category || '',
      });
    }
  }, [editTransaction]);

  const categories = [
    'Groceries & Food', 'Transportation', 'Entertainment', 'Shopping', 
    'Utilities', 'Healthcare', 'Education', 'Investment', 'Salary',
    'Freelance', 'Rent/EMI', 'Insurance', 'Emergency', 'Reimbursement',
    'Loan', 'Gift', 'Others'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const transaction: Transaction = {
      id: editTransaction?.id || Date.now().toString(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      type: formData.type,
      account: formData.account,
      category: formData.category || undefined,
    };

    onSubmit(transaction);
  };

  const getAccountLabel = (account: string) => {
    return account === 'account1' ? 'Personal Account' : 'Salary Account';
  };

  const getTypeColor = (type: string) => {
    return type === 'income' 
      ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
      : 'bg-gradient-to-r from-red-500 to-pink-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <div className={`p-2 rounded-lg ${getTypeColor(formData.type)} text-white shadow-md`}>
                <DollarSign className="w-5 h-5" />
              </div>
              {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type and Account Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Transaction Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={formData.type === 'income' ? 'default' : 'outline'}
                    onClick={() => setFormData({...formData, type: 'income'})}
                    className={`${formData.type === 'income' 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    Income
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === 'expense' ? 'default' : 'outline'}
                    onClick={() => setFormData({...formData, type: 'expense'})}
                    className={`${formData.type === 'expense' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                      : 'border-red-200 text-red-700 hover:bg-red-50'
                    }`}
                  >
                    Expense
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Account</Label>
                <Select value={formData.account} onValueChange={(value) => setFormData({...formData, account: value as 'account1' | 'account2'})}>
                  <SelectTrigger className="bg-white border-slate-200">
                    <Building className="w-4 h-4 mr-2 text-slate-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Personal</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="account2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Salary</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-700 font-medium">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`bg-white border-slate-200 ${errors.date ? 'border-red-300' : ''}`}
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-700 font-medium">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Amount (₹)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className={`bg-white border-slate-200 ${errors.amount ? 'border-red-300' : ''}`}
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                <Tag className="w-4 h-4 inline mr-2" />
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-slate-700 font-medium">
                <FileText className="w-4 h-4 inline mr-2" />
                Reason/Description
              </Label>
              <Textarea
                id="reason"
                placeholder="Enter transaction details..."
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className={`bg-white border-slate-200 min-h-[100px] ${errors.reason ? 'border-red-300' : ''}`}
              />
              {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {editTransaction ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
