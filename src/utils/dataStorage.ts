
import { Transaction } from '../types/Transaction';

const STORAGE_KEY = 'finance_tracker_transactions';

export const saveTransactionsToStorage = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

export const loadTransactionsFromStorage = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transactions from localStorage:', error);
    return [];
  }
};

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  const headers = ['Date', 'Amount', 'Type', 'Account', 'Reason'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      t.amount.toString(),
      t.type,
      t.account === 'account1' ? 'Account 1' : 'Account 2',
      `"${t.reason.replace(/"/g, '""')}"` // Escape quotes in reason
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importTransactionsFromCSV = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const transactions: Transaction[] = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [date, amount, type, account, reason] = line.split(',');
            transactions.push({
              id: Date.now().toString() + i,
              date: date,
              amount: parseFloat(amount),
              type: type as 'income' | 'expense',
              account: account === 'Account 1' ? 'account1' : 'account2',
              reason: reason.replace(/^"|"$/g, '').replace(/""/g, '"') // Unescape quotes
            });
          }
        }
        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};
