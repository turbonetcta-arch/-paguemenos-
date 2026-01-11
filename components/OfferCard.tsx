
import React from 'react';

interface OfferCardProps {
  itemName: string;
  price: number;
  imageUrl: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ itemName, price, imageUrl }) => {
  const [whole, cents] = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).split(',');

  return (
    <div className="flex flex-col bg-white rounded-[3rem] overflow-hidden shadow-2xl offer-glow w-full max-w-lg animate-pulse-slow border-[10px] border-white">
      {/* Offer Header Tag */}
      <div className="bg-[#d61a1a] py-5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-pulse"></div>
        <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase relative z-10">
          OFERTA IMBATÍVEL
        </h3>
      </div>

      {/* Offer Content */}
      <div className="p-8 flex flex-col items-center gap-6 text-gray-900 bg-gradient-to-b from-white to-gray-50">
        <h4 className="text-5xl font-black text-[#d61a1a] text-center leading-none uppercase tracking-tighter">
          {itemName}
        </h4>
        
        <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden border-8 border-gray-100 shadow-2xl group">
          <img 
            src={imageUrl} 
            alt={itemName} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-gray-400 uppercase tracking-[0.3em] mb-[-10px]">Apenas</span>
          <div className="flex items-start text-[#d61a1a] font-oswald leading-none">
            <span className="text-5xl font-bold mt-4">R$</span>
            <span className="text-[12rem] font-black -tracking-widest drop-shadow-xl">{whole}</span>
            <div className="flex flex-col mt-4 ml-2">
              <span className="text-7xl font-bold border-b-8 border-[#d61a1a] leading-none">,{cents}</span>
              <span className="text-4xl font-bold text-[#d61a1a]/60 text-right mt-1">kg</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer stripe */}
      <div className="bg-yellow-400 h-6 w-full flex items-center justify-center">
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-[#d61a1a] rounded-full"></div>
          <div className="w-2 h-2 bg-[#d61a1a] rounded-full"></div>
          <div className="w-2 h-2 bg-[#d61a1a] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
