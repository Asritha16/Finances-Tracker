
import React, { useRef } from 'react';
import { Download, Upload, Database } from 'lucide-react';
import { Transaction } from '../types/Transaction';
import { exportTransactionsToCSV, importTransactionsFromCSV } from '../utils/dataStorage';

interface DataControlsProps {
  transactions: Transaction[];
  onImportTransactions: (transactions: Transaction[]) => void;
}

const DataControls: React.FC<DataControlsProps> = ({ transactions, onImportTransactions }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }
    exportTransactionsToCSV(transactions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedTransactions = await importTransactionsFromCSV(file);
        if (window.confirm(`Import ${importedTransactions.length} transactions? This will replace your current data.`)) {
          onImportTransactions(importedTransactions);
        }
      } catch (error) {
        alert('Error importing file. Please check the format.');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Database className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Data Management</h2>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={16} />
          Export to CSV
        </button>
        
        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload size={16} />
          Import from CSV
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <p className="text-sm text-gray-600 mt-3">
        Your data is automatically saved locally and never leaves your device. Export regularly for backup.
      </p>
    </div>
  );
};

export default DataControls;
