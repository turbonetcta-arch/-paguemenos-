
import React, { useState } from 'react';
import { Category, MenuItem } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Zap, 
  Save, 
  Smartphone,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface RemoteControllerProps {
  categories: Category[];
  onSync: (category: Category) => void;
}

const RemoteController: React.FC<RemoteControllerProps> = ({ categories, onSync }) => {
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const activeCategory = categories[activeCatIndex];

  const updatePrice = (itemId: string, delta: number) => {
    const updatedItems = activeCategory.items.map(item => {
      if (item.id === itemId) {
        return { ...item, price: Math.max(0, item.price + delta) };
      }
      return item;
    });

    const updatedCategory = { ...activeCategory, items: updatedItems };
    onSync(updatedCategory);
    setLastSync(new Date().toLocaleTimeString());
  };

  const toggleOffer = (itemId: string) => {
    const updatedItems = activeCategory.items.map(item => {
      if (item.id === itemId) {
        return { ...item, isOffer: !item.isOffer };
      }
      return item;
    });

    const updatedCategory = { ...activeCategory, items: updatedItems };
    onSync(updatedCategory);
    setLastSync(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none">
      {/* Header Mobile */}
      <header className="bg-[#111] p-5 border-b border-white/10 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg animate-pulse">
            <Smartphone size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight">Controle Remoto</h1>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Conectado à TV
            </p>
          </div>
        </div>
        {lastSync && (
          <div className="text-right">
             <p className="text-[8px] text-gray-500 font-bold uppercase">Última Sinc.</p>
             <p className="text-[10px] font-mono text-yellow-500">{lastSync}</p>
          </div>
        )}
      </header>

      {/* Navegação de Categorias */}
      <div className="flex items-center bg-[#181818] p-2 sticky top-[73px] z-40 border-b border-white/5">
        <button 
          onClick={() => setActiveCatIndex(prev => Math.max(0, prev - 1))}
          className="p-4 text-gray-500 hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-xl font-black uppercase text-yellow-400 italic">
            {activeCategory.label}
          </h2>
        </div>
        <button 
          onClick={() => setActiveCatIndex(prev => Math.min(categories.length - 1, prev + 1))}
          className="p-4 text-gray-500 hover:text-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Lista de Produtos para Edição Rápida */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {activeCategory.items.map(item => (
          <div key={item.id} className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 shadow-lg active:scale-[0.98] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg font-bold uppercase tracking-tight truncate pr-4">{item.name}</span>
              <button 
                onClick={() => toggleOffer(item.id)}
                className={`p-2 rounded-xl transition-all ${item.isOffer ? 'bg-yellow-400 text-black' : 'bg-white/5 text-gray-600'}`}
              >
                <Zap size={20} fill={item.isOffer ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button 
                onClick={() => updatePrice(item.id, -1)}
                className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-red-500"
              >
                <Minus size={28} />
              </button>
              
              <div className="flex-1 text-center bg-black rounded-2xl py-3 border border-white/5">
                <span className="text-[10px] block text-gray-500 font-black uppercase mb-1">Preço Atual</span>
                <span className="text-3xl font-mono font-black text-white">
                  {item.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button 
                onClick={() => updatePrice(item.id, 1)}
                className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-green-500"
              >
                <Plus size={28} />
              </button>
            </div>
            
            <div className="flex gap-2 mt-4">
               <button onClick={() => updatePrice(item.id, -0.1)} className="flex-1 bg-white/5 py-2 rounded-lg text-xs font-bold">-0,10</button>
               <button onClick={() => updatePrice(item.id, -0.5)} className="flex-1 bg-white/5 py-2 rounded-lg text-xs font-bold">-0,50</button>
               <button onClick={() => updatePrice(item.id, 0.5)} className="flex-1 bg-white/5 py-2 rounded-lg text-xs font-bold">+0,50</button>
               <button onClick={() => updatePrice(item.id, 0.1)} className="flex-1 bg-white/5 py-2 rounded-lg text-xs font-bold">+0,10</button>
            </div>
          </div>
        ))}
      </main>

      {/* Barra de Ação Inferior */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 flex gap-3">
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 bg-white/5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} /> Atualizar
        </button>
        <button 
          onClick={() => alert('Sincronização Automática Ativa!')}
          className="flex-[2] bg-green-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
        >
          <CheckCircle2 size={18} /> Pronto
        </button>
      </footer>
    </div>
  );
};

export default RemoteController;
