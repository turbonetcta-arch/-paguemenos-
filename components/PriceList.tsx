
import React, { useEffect, useState, useRef } from 'react';
import { MenuItem } from '../types';

interface PriceListProps {
  items: MenuItem[];
  fullWidth?: boolean;
}

const PriceList: React.FC<PriceListProps> = ({ items, fullWidth = false }) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const prevItemsRef = useRef<MenuItem[]>([]);

  useEffect(() => {
    // Encontrar qual item mudou de preço
    const changedItem = items.find((item, index) => {
      const prevItem = prevItemsRef.current[index];
      return prevItem && prevItem.id === item.id && prevItem.price !== item.price;
    });

    if (changedItem) {
      setHighlightedId(changedItem.id);
      const timeout = setTimeout(() => setHighlightedId(null), 3000);
      return () => clearTimeout(timeout);
    }

    prevItemsRef.current = items;
  }, [items]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${fullWidth ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-x-6 gap-y-3 w-full bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500`}>
      {items.map((item, idx) => (
        <div 
          key={item.id} 
          className={`flex items-center justify-between py-4 px-6 rounded-2xl transition-all duration-700 group border ${
            highlightedId === item.id 
              ? 'bg-yellow-400/30 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-[1.02] z-10' 
              : 'border-transparent hover:bg-white/10 hover:border-white/5'
          } ${
            idx % 2 === 0 && highlightedId !== item.id ? 'bg-white/5' : 'bg-transparent'
          }`}
        >
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-3xl font-black uppercase tracking-tighter text-white leading-none truncate group-hover:text-yellow-400 transition-colors">
              {item.name}
            </span>
            <div className="flex items-center gap-2 mt-2">
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-[10px] font-bold text-gray-500 line-through">
                  R$ {item.originalPrice.toFixed(2)}
                </span>
              )}
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${item.isOffer ? 'text-yellow-400' : 'text-red-400 opacity-80'}`}>
                {item.isOffer ? 'Oferta Especial' : 'Qualidade Premium'}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 ml-4 shrink-0">
            <span className="text-xl font-bold text-yellow-500">R$</span>
            <span className={`text-5xl font-oswald font-black tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] transition-colors ${highlightedId === item.id ? 'text-yellow-400' : 'text-white'}`}>
              {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm font-bold text-white/40 ml-1 uppercase">{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceList;
