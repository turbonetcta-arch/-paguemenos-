
import React from 'react';
import { MenuItem } from '../types';
import { Zap } from 'lucide-react';

interface OffersSideAreaProps {
  items: MenuItem[];
}

const OffersSideArea: React.FC<OffersSideAreaProps> = ({ items }) => {
  const offers = items.filter(item => item.isOffer || (item.originalPrice && item.originalPrice > item.price));

  if (offers.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="bg-yellow-400 p-3 rounded-t-2xl flex items-center justify-center gap-2 shadow-lg">
        <Zap className="text-red-600 fill-red-600" size={24} />
        <h3 className="text-xl font-black text-red-700 uppercase italic tracking-tighter">
          Ofertas do Dia
        </h3>
      </div>
      
      <div className="flex-1 bg-red-900/40 backdrop-blur-md rounded-b-2xl border-x border-b border-yellow-400/30 p-4 space-y-4 overflow-hidden">
        {offers.slice(0, 4).map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-3 shadow-md border-l-8 border-red-600 animate-pulse-slow">
            <h4 className="text-sm font-black text-gray-800 uppercase leading-none mb-1 truncate">
              {item.name}
            </h4>
            <div className="flex flex-col">
              {item.originalPrice && (
                <span className="text-[10px] font-bold text-gray-400 line-through">
                  De: R$ {item.originalPrice.toFixed(2)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-red-600 uppercase">Por</span>
                <span className="text-xs font-bold text-red-600">R$</span>
                <span className="text-3xl font-oswald font-black text-red-600 leading-none">
                  {item.price.toFixed(2).split('.')[0]}
                </span>
                <span className="text-sm font-bold text-red-600">
                  ,{item.price.toFixed(2).split('.')[1]}
                </span>
                <span className="text-[10px] font-bold text-gray-500 ml-1">/{item.unit}</span>
              </div>
            </div>
          </div>
        ))}
        
        {offers.length > 4 && (
          <div className="text-center">
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest animate-bounce inline-block">
              Mais ofertas no balcão ▼
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersSideArea;
