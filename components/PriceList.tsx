
import React from 'react';
import { MenuItem } from '../types';

interface PriceListProps {
  items: MenuItem[];
}

const PriceList: React.FC<PriceListProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-1 w-full max-w-2xl bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-2xl">
      {items.map((item, idx) => (
        <div 
          key={item.id} 
          className={`flex items-center justify-between py-2 px-4 rounded-lg transition-colors ${
            idx % 2 === 0 ? 'bg-white/5' : ''
          }`}
        >
          <div className="flex flex-col">
            <span className="text-2xl font-black uppercase tracking-tight text-white leading-none">
              {item.name}
            </span>
            <span className="text-xs font-bold text-red-300 uppercase tracking-widest mt-1">
              Preço por {item.unit}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-yellow-400">R$</span>
            <span className="text-4xl font-oswald font-bold text-white tracking-tighter">
              {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceList;
