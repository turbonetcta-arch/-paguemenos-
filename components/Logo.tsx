
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-64 h-64'
  };

  const textSizes = {
    sm: { smart: 'text-[12px]', pague: 'text-[9px]' },
    md: { smart: 'text-[18px]', pague: 'text-[12px]' },
    lg: { smart: 'text-[32px]', pague: 'text-[20px]' },
    xl: { smart: 'text-[54px]', pague: 'text-[32px]' }
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full glossy-red ${sizeClasses[size]} shrink-0 select-none shadow-[0_15px_45px_rgba(0,0,0,0.6)] border-b-4 border-black/20`}>
      {/* Efeito de Reflexo Realista */}
      <div className="absolute top-[8%] left-[15%] w-[40%] h-[20%] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[2px] rotate-[-15deg] pointer-events-none"></div>
      
      <div className="flex flex-col items-center justify-center text-center -mt-2">
        {/* Texto "Smart" com Sombra */}
        <span className={`font-pacifico text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] leading-none mb-1 ${textSizes[size].smart}`}>
          Smart
        </span>
        
        {/* Container do Carrinho (Fundo Branco do Ícone) */}
        <div className="relative flex flex-col items-center">
          <div className="bg-white/95 rounded-[1rem] px-4 py-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.3)] flex flex-col items-center border-b-2 border-gray-300">
            <span className={`font-black text-[#d61a1a] uppercase leading-none tracking-tighter ${textSizes[size].pague}`}>
              PAGUE
            </span>
            <span className={`font-black text-[#d61a1a] uppercase leading-none tracking-tighter ${textSizes[size].pague}`}>
              MENOS
            </span>
          </div>
          
          {/* Rodinhas 3D */}
          <div className="flex gap-6 -mt-2">
            <div className="w-3 h-3 bg-white rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.4)] border-b-2 border-gray-300"></div>
            <div className="w-3 h-3 bg-white rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.4)] border-b-2 border-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
