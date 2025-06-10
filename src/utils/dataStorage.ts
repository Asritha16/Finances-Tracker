
import { Transaction } from '../types/Transaction';
import * as XLSX from 'xlsx';

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

export const exportTransactionsToExcel = (transactions: Transaction[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    transactions.map(t => ({
      Date: t.date,
      Amount: t.amount,
      Type: t.type,
      Account: t.account === 'account1' ? 'Account 1' : 'Account 2',
      Reason: t.reason
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  const fileName = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const importTransactionsFromExcel = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const transactions: Transaction[] = jsonData.map((row: any, index) => ({
          id: Date.now().toString() + index,
          date: row.Date || new Date().toISOString().split('T')[0],
          amount: parseFloat(row.Amount) || 0,
          type: (row.Type === 'income' ? 'income' : 'expense') as 'income' | 'expense',
          account: (row.Account === 'Account 1' ? 'account1' : 'account2') as 'account1' | 'account2',
          reason: row.Reason || 'Imported transaction'
        }));

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};
