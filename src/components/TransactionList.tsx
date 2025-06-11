
import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter, Calendar, DollarSign, User, Tag } from 'lucide-react';
import { Transaction } from '../types/Transaction';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  isPreview?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  isPreview = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesAccount = accountFilter === 'all' || transaction.account === accountFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;

    return matchesSearch && matchesType && matchesAccount && matchesCategory;
  });

  const displayTransactions = isPreview ? filteredTransactions.slice(0, 5) : filteredTransactions;

  const getUniqueCategories = () => {
    const categories = transactions
      .map(t => t.category)
      .filter((category, index, arr) => category && arr.indexOf(category) === index);
    return categories;
  };

  const getTypeColor = (type: string) => {
    return type === 'income' 
      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
      : 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
  };

  const getAccountBadge = (account: string) => {
    const isPersonal = account === 'account1';
    return (
      <Badge 
        variant="outline" 
        className={`${isPersonal 
          ? 'border-blue-200 bg-blue-50 text-blue-700' 
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        } font-medium`}
      >
        {isPersonal ? 'Personal' : 'Salary'}
      </Badge>
    );
  };

  if (transactions.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-full mb-4">
            <DollarSign className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No transactions found</h3>
          <p className="text-slate-500 text-center max-w-sm">
            {isPreview ? "Recent transactions will appear here" : "Start by adding your first transaction"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {!isPreview && (
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Filter className="w-5 h-5" />
              Filter Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by reason or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Filter by account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="account1">Personal Account</SelectItem>
                  <SelectItem value="account2">Salary Account</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category!}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {displayTransactions.map((transaction) => (
          <Card key={transaction.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-slate-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${getTypeColor(transaction.type)} shadow-md`}>
                    {transaction.type === 'income' ? (
                      <DollarSign className="w-4 h-4" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800 truncate">{transaction.reason}</h3>
                      {transaction.category && (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                          <Tag className="w-3 h-3 mr-1" />
                          {transaction.category}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {getAccountBadge(transaction.account)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {!isPreview && (onEditTransaction || onDeleteTransaction) && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEditTransaction && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditTransaction(transaction)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      {onDeleteTransaction && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isPreview && filteredTransactions.length === 0 && transactions.length > 0 && (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Search className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-slate-500">No transactions match your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionList;
