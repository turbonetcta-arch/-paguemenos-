
import React, { useState, useEffect, useCallback } from 'react';
import { Category, ViewMode } from './types';
import { INITIAL_CATEGORIES } from './constants';
import PriceList from './components/PriceList';
import OfferCard from './components/OfferCard';
import OffersSideArea from './components/OffersSideArea';
import AdminPanel from './components/AdminPanel';
import { UtensilsCrossed, LayoutDashboard, Clock, Monitor, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('display');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTvMode, setIsTvMode] = useState(false);
  
  // Estados de Rotação
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (viewMode === 'display') {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % categories.length);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [viewMode, categories.length]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCategory = categories[currentIndex];

  const handleUpdateCategory = useCallback((updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
  }, []);

  const triggerSpin = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000); // Duração da animação 360
  };

  const toggleTvMode = () => {
    if (!isTvMode) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Erro ao entrar em tela cheia: ${e.message}`);
      });
      setIsTvMode(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsTvMode(false);
    }
  };

  // Escutar saída de tela cheia pelo botão ESC do teclado
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsTvMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Lógica de Estilo para Rotação
  const isPortrait = rotation === 90 || rotation === 270;
  const rotationStyle: React.CSSProperties = {
    transform: `translate(-50%, -50%) rotate(${rotation}deg) ${isSpinning ? 'rotate(360deg)' : ''}`,
    transition: isSpinning ? 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)' : 'transform 0.6s ease-in-out',
    width: isPortrait ? '100vh' : '100vw',
    height: isPortrait ? '100vw' : '100vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      
      {/* Botão Flutuante para Sair do Modo TV (visível apenas no modo TV) */}
      {isTvMode && (
        <button 
          onClick={toggleTvMode}
          className="fixed top-4 right-4 z-50 p-2 bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity"
          title="Sair do Modo TV"
        >
          <XCircle size={32} />
        </button>
      )}

      {/* Wrapper Principal com Rotação e Novo Fundo Temático */}
      <div 
        style={rotationStyle}
        className="flex flex-col bg-meat-table selection:bg-yellow-400 selection:text-black overflow-hidden"
      >
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <UtensilsCrossed size={400} />
        </div>

        {/* Header Banner */}
        <header className={`relative z-10 w-full pt-6 pb-2 transition-all duration-500 ${isTvMode ? 'scale-105 origin-top' : ''}`}>
          <div className="bg-black/40 backdrop-blur-md mx-auto max-w-[95%] px-8 py-3 rounded-full flex justify-between items-center border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <UtensilsCrossed className="text-red-700" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-oswald font-black text-white tracking-tighter leading-none uppercase">
                  AÇOUGUE <span className="text-yellow-400">QUALIDADE</span>
                </h1>
                {!isTvMode && <p className="text-[10px] font-bold text-red-200 tracking-[0.3em] uppercase">Tradição em Cortes Nobres</p>}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end mr-4">
                 <div className="flex items-center gap-2 text-white">
                   <Clock size={14} className="text-yellow-400" />
                   <span className="text-lg font-bold font-oswald">{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                 {!isTvMode && <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Digital Board v4.0</span>}
              </div>

              {!isTvMode && (
                <nav className="flex gap-1">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`px-4 py-1.5 rounded-full font-black uppercase text-xs transition-all ${
                        currentIndex === idx 
                          ? 'bg-yellow-400 text-red-900 scale-105 shadow-xl' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 relative z-10 max-w-[100%] mx-auto w-full px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-transform duration-700 ${isTvMode ? 'scale-110' : ''}`}>
          
          <div className="lg:col-span-6 flex flex-col space-y-6 animate-in slide-in-from-left duration-700">
             <div className="flex items-center gap-3">
                <div className="h-10 w-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                <h2 className="text-5xl font-oswald font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">
                  {activeCategory.label}
                </h2>
             </div>
             
             <PriceList items={activeCategory.items} />
             
             <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-[0.2em] text-center">
                  Preços sujeitos a alteração conforme disponibilidade de estoque
                </p>
             </div>
          </div>

          <div className="lg:col-span-3 h-full flex flex-col animate-in slide-in-from-bottom duration-1000 delay-200">
             <OffersSideArea items={activeCategory.items} />
          </div>

          <div className="lg:col-span-3 flex justify-center lg:justify-end animate-in zoom-in duration-700 delay-300">
            <OfferCard 
              itemName={activeCategory.offerItemName || activeCategory.items[0].name}
              price={activeCategory.offerPrice || activeCategory.items[0].price}
              imageUrl={activeCategory.offerImage || 'https://picsum.photos/600/400'}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className={`relative z-10 w-full p-4 flex justify-between items-center bg-black/70 backdrop-blur-xl border-t border-yellow-400/20 transition-all duration-500 ${isTvMode ? 'opacity-30 hover:opacity-100' : ''}`}>
          <div className="flex gap-8">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Atendimento</span>
                <span className="text-white font-bold text-md italic">(11) 98765-4321</span>
             </div>
             {!isTvMode && (
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Instagram</span>
                  <span className="text-white font-bold text-md">@açougue.qualidade</span>
               </div>
             )}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden hidden md:block">
              <div 
                className="h-full bg-yellow-400 transition-all duration-[15000ms] ease-linear"
                key={currentIndex}
                style={{ width: '100%' }}
              ></div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={toggleTvMode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-tighter ${isTvMode ? 'bg-yellow-400 text-black shadow-lg' : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'}`}
              >
                <Monitor size={14} />
                {isTvMode ? 'Modo TV Ativo' : 'Modo TV'}
              </button>

              <button 
                onClick={() => setViewMode('admin')}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-tighter"
              >
                <LayoutDashboard size={14} />
                Painel
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Admin Panel Modal */}
      {viewMode === 'admin' && (
        <AdminPanel 
          categories={categories}
          onUpdateCategory={handleUpdateCategory}
          onClose={() => setViewMode('display')}
          rotation={rotation}
          setRotation={setRotation}
          triggerSpin={triggerSpin}
        />
      )}
    </div>
  );
};

export default App;
