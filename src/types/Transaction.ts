
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  reason: string;
  type: 'income' | 'expense';
  account: 'account1' | 'account2';
}
