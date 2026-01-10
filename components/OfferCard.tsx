
import React from 'react';

interface OfferCardProps {
  itemName: string;
  price: number;
  imageUrl: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ itemName, price, imageUrl }) => {
  const [whole, cents] = price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).split(',');

  return (
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl offer-glow w-full max-w-md animate-pulse-slow">
      {/* Offer Header Tag */}
      <div className="bg-red-600 py-3 text-center">
        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">
          OFERTA IMBATÍVEL
        </h3>
      </div>

      {/* Offer Content */}
      <div className="p-6 flex flex-col items-center gap-4 text-gray-900">
        <h4 className="text-4xl font-black text-red-700 text-center leading-none uppercase">
          {itemName}
        </h4>
        
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-red-500 shadow-inner">
          <img 
            src={imageUrl} 
            alt={itemName} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-400 uppercase tracking-widest">Apenas</span>
          <div className="flex items-start text-red-700 font-oswald leading-none">
            <span className="text-4xl font-bold mt-2">R$</span>
            <span className="text-9xl font-black -tracking-widest">{whole}</span>
            <div className="flex flex-col mt-2 ml-1">
              <span className="text-5xl font-bold border-b-4 border-red-700">,{cents}</span>
              <span className="text-2xl font-bold text-red-700/60 text-right">kg</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer stripe */}
      <div className="bg-yellow-400 h-4 w-full"></div>
    </div>
  );
};

export default OfferCard;
