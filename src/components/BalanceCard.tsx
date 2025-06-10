
import React from 'react';

interface BalanceCardProps {
  title: string;
  balance: number;
  icon: React.ReactNode;
  gradient: string;
  isTotal?: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ title, balance, icon, gradient, isTotal }) => {
  const isNegative = balance < 0;
  
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-white/30 ${isTotal ? 'ring-2 ring-purple-300 shadow-purple-200/50' : ''}`}>
      <div className={`bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative flex items-center justify-between text-white">
          <div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold mt-2">
              ₹{Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              {isNegative && <span className="text-red-200 ml-2 text-lg">(Deficit)</span>}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
            {icon}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className={`text-sm font-semibold flex items-center gap-2 ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isNegative ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          {isNegative ? 'Negative Balance' : 'Positive Balance'}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
