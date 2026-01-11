
import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const textSizes = {
    sm: { smart: 'text-[10px]', pague: 'text-[8px]' },
    md: { smart: 'text-[14px]', pague: 'text-[10px]' },
    lg: { smart: 'text-[18px]', pague: 'text-[14px]' },
    xl: { smart: 'text-[28px]', pague: 'text-[20px]' }
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full glossy-red ${sizeClasses[size]} shrink-0 select-none`}>
      {/* Reflexo de Brilho Superior */}
      <div className="absolute top-[10%] left-[15%] w-[30%] h-[30%] bg-white/30 rounded-full blur-md pointer-events-none"></div>
      
      <div className="flex flex-col items-center justify-center text-center mt-[-4px]">
        {/* Texto "Smart" em Cursive */}
        <span className={`font-pacifico text-white drop-shadow-md leading-none mb-1 ${textSizes[size].smart}`}>
          Smart
        </span>
        
        {/* Container do Carrinho e Texto Inferior */}
        <div className="relative flex flex-col items-center">
          {/* Ícone de Carrinho Estilizado como fundo branco */}
          <div className="bg-white rounded-lg px-2 py-1 shadow-inner flex flex-col items-center">
            <span className={`font-black text-[#d61a1a] uppercase leading-none tracking-tighter ${textSizes[size].pague}`}>
              PAGUE
            </span>
            <span className={`font-black text-[#d61a1a] uppercase leading-none tracking-tighter ${textSizes[size].pague}`}>
              MENOS
            </span>
          </div>
          
          {/* Rodinhas do Carrinho */}
          <div className="flex gap-4 mt-[-2px]">
            <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
            <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
