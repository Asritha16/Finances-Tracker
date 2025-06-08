
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
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200 ${isTotal ? 'ring-2 ring-purple-200' : ''}`}>
      <div className={`bg-gradient-to-r ${gradient} p-4`}>
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-sm font-medium opacity-90">{title}</h3>
            <p className="text-2xl font-bold">
              ₹{Math.abs(balance).toFixed(2)}
              {isNegative && <span className="text-red-200 ml-1">(Deficit)</span>}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className={`text-sm ${isNegative ? 'text-red-600' : 'text-green-600'} font-medium`}>
          {isNegative ? 'Negative Balance' : 'Positive Balance'}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
