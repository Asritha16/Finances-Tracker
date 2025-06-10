
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
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-white/30 ${isTotal ? 'ring-1 ring-purple-300' : ''}`}>
      <div className={`bg-gradient-to-br ${gradient} p-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="relative flex items-center justify-between text-white">
          <div>
            <h3 className="text-xs font-semibold opacity-90 uppercase tracking-wider">{title}</h3>
            <p className="text-xl font-bold mt-1">
              ₹{Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              {isNegative && <span className="text-red-200 ml-1 text-sm">(Deficit)</span>}
            </p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/30">
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <div className={`text-xs font-semibold flex items-center gap-2 ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isNegative ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          {isNegative ? 'Negative Balance' : 'Positive Balance'}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
