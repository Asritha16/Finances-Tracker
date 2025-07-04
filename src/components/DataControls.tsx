
import React, { useRef } from 'react';
import { Download, Upload, Database, FileSpreadsheet } from 'lucide-react';
import { Transaction } from '../types/Transaction';
import { exportTransactionsToExcel, importTransactionsFromExcel } from '../utils/dataStorage';

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
    exportTransactionsToExcel(transactions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedTransactions = await importTransactionsFromExcel(file);
        if (window.confirm(`Import ${importedTransactions.length} transactions? This will replace your current data.`)) {
          onImportTransactions(importedTransactions);
        }
      } catch (error) {
        alert('Error importing file. Please check the Excel format.');
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
          <Database className="text-white" size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Data Management</h2>
          <p className="text-sm text-slate-600">Secure local storage with Excel backup</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-sm"
        >
          <Download size={16} />
          <span>Export to Excel</span>
          <FileSpreadsheet size={14} className="opacity-80" />
        </button>
        
        <button
          onClick={handleImportClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-sm"
        >
          <Upload size={16} />
          <span>Import from Excel</span>
          <FileSpreadsheet size={14} className="opacity-80" />
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default DataControls;
