
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Category, ViewMode, SyncMessage } from './types';
import { INITIAL_CATEGORIES } from './constants';
import PriceList from './components/PriceList';
import OfferCard from './components/OfferCard';
import OffersSideArea from './components/OffersSideArea';
import AdminPanel from './components/AdminPanel';
import RemoteAccessModal from './components/RemoteAccessModal';
import RemoteController from './components/RemoteController';
import Logo from './components/Logo';
import { LayoutDashboard, Clock, Smartphone, Wifi, MousePointer2, MonitorPlay } from 'lucide-react';

const syncChannel = new BroadcastChannel('smart-pague-menos-sync');

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('display');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTvMode, setIsTvMode] = useState(false);
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);
  const [showSyncToast, setShowSyncToast] = useState(false);
  const [syncToastMsg, setSyncToastMsg] = useState('');
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [rotation, setRotation] = useState(0);
  const [resolution, setResolution] = useState<'auto' | '1080p' | '720p'>('auto');
  const [isSpinning, setIsSpinning] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Lógica de Redimensionamento Automático
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    // Garantir que o modo TV reaja a mudanças de orientação
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const toggleTvMode = useCallback((forceState?: boolean) => {
    const newState = forceState !== undefined ? forceState : !isTvMode;
    
    if (newState) {
      document.documentElement.requestFullscreen().catch(() => {
        console.warn("Fullscreen negado pelo navegador.");
      });
      setIsTvMode(true);
      setShowControls(false);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsTvMode(false);
      setShowControls(true);
    }
  }, [isTvMode]);

  useEffect(() => {
    const handleActivity = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (isTvMode) {
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 5000);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isTvMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setViewMode('remote');
  }, []);

  // Listener de Automação Remota
  useEffect(() => {
    const handleMessage = (event: MessageEvent<SyncMessage>) => {
      if (event.data.type === 'UPDATE_CATEGORY') {
        const updatedCat = event.data.payload;
        setCategories(prev => prev.map(cat => cat.id === updatedCat.id ? updatedCat : cat));
        if (viewMode === 'display') {
          setSyncToastMsg('Preços Atualizados via Celular');
          setShowSyncToast(true);
          setTimeout(() => setShowSyncToast(false), 3000);
        }
      }
      
      if (event.data.type === 'TOGGLE_TV' && viewMode === 'display') {
        toggleTvMode(event.data.payload);
        setSyncToastMsg(event.data.payload ? 'Modo TV Ativado Remotamente' : 'Modo TV Desativado');
        setShowSyncToast(true);
        setTimeout(() => setShowSyncToast(false), 3000);
      }
    };
    syncChannel.addEventListener('message', handleMessage);
    return () => syncChannel.removeEventListener('message', handleMessage);
  }, [viewMode, toggleTvMode]);

  const syncUpdate = useCallback((updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
    syncChannel.postMessage({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
  }, []);

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

  const triggerSpin = useCallback(() => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
  }, []);

  // Cálculo de Escala Automática para TV (Ajuste de Resolução)
  const layoutMetrics = useMemo(() => {
    const baseW = 1920;
    const baseH = 1080;
    
    // Define a resolução alvo
    const targetW = resolution === 'auto' ? baseW : (resolution === '1080p' ? 1920 : 1280);
    const targetH = resolution === 'auto' ? baseH : (resolution === '1080p' ? 1080 : 720);
    
    const isPortrait = rotation === 90 || rotation === 270;
    
    // Se estiver rotacionado, as dimensões se invertem no cálculo de escala
    const effectiveW = isPortrait ? targetH : targetW;
    const effectiveH = isPortrait ? targetW : targetH;
    
    const scaleX = windowSize.width / effectiveW;
    const scaleY = windowSize.height / effectiveH;
    
    // No modo TV, sempre preenche a tela. No modo normal, limita ao tamanho da janela.
    const scale = Math.min(scaleX, scaleY);

    return { 
      width: `${targetW}px`, 
      height: `${targetH}px`, 
      scale: isTvMode ? scale : Math.min(scale, 1)
    };
  }, [resolution, windowSize, rotation, isTvMode]);

  const rotationStyle: React.CSSProperties = {
    transform: `translate(-50%, -50%) rotate(${rotation + (isSpinning ? 360 : 0)}deg) scale(${layoutMetrics.scale})`,
    width: layoutMetrics.width,
    height: layoutMetrics.height,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'center center',
    transition: isSpinning ? 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.3s ease-out',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  };

  if (viewMode === 'remote') return (
    <RemoteController 
      categories={categories} 
      onSync={syncUpdate} 
      onExit={() => setViewMode('display')} 
    />
  );

  const activeCategory = categories[currentIndex];
  const hasMainOffer = activeCategory.showMainOffer;
  const hasSideOffers = activeCategory.showSideOffers;
  const mainListColSpan = !hasMainOffer && !hasSideOffers ? "lg:col-span-12" : (hasMainOffer && hasSideOffers ? "lg:col-span-6" : (hasMainOffer ? "lg:col-span-8" : "lg:col-span-9"));

  return (
    <div className={`relative min-h-screen w-full bg-black overflow-hidden select-none ${!showControls && isTvMode ? 'cursor-none' : 'cursor-default'}`}>
      
      {showSyncToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[250] bg-yellow-400 text-red-900 px-12 py-6 rounded-[3rem] font-black uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(250,204,21,0.5)] flex items-center gap-6 animate-in fade-in zoom-in duration-500">
           <div className="bg-[#d61a1a] p-3 rounded-full animate-bounce shadow-lg">
             <Wifi size={24} className="text-white" />
           </div>
           <span className="text-2xl italic">{syncToastMsg}</span>
        </div>
      )}

      <div style={rotationStyle} className="flex flex-col bg-meat-table shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        <header className="relative z-10 w-full pt-12 pb-6 px-16">
          <div className="bg-black/60 backdrop-blur-2xl px-12 py-6 rounded-[3rem] flex justify-between items-center border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            <div className="flex items-center gap-10 relative z-10">
              <Logo size="lg" />
              <div>
                <h1 className="text-7xl font-oswald font-black text-white tracking-tighter uppercase leading-none">
                  Smart <span className="text-yellow-400">PAGUE MENOS</span>
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-1 w-16 bg-[#d61a1a]"></div>
                  <p className="text-xl font-bold text-red-100 tracking-[0.4em] uppercase">O Melhor Açougue da Região</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12 relative z-10">
              <div className="bg-white/5 px-10 py-5 rounded-[2rem] border border-white/10 flex flex-col items-center shadow-inner">
                 <div className="flex items-center gap-4 text-white">
                   <Clock size={32} className="text-yellow-400" />
                   <span className="text-6xl font-black font-oswald tabular-nums drop-shadow-lg">
                     {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                   </span>
                 </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span> Link Ativo
                </span>
                <span className="text-[10px] font-bold text-white/30 uppercase mt-1 tracking-widest">Resolução Automática: {windowSize.width}x{windowSize.height}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative z-10 w-full px-16 py-8 grid grid-cols-12 gap-10 items-start overflow-hidden">
          <div className={`${mainListColSpan} flex flex-col space-y-8 animate-in slide-in-from-left duration-1000`}>
             <div className="flex items-center gap-6">
                <div className="h-24 w-6 bg-[#d61a1a] rounded-full shadow-[0_0_40px_rgba(214,26,26,0.6)]"></div>
                <h2 className="text-9xl font-oswald font-black text-white italic tracking-tighter uppercase drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]">
                  {activeCategory.label}
                </h2>
             </div>
             
             <div className="transition-all duration-500">
               <PriceList 
                 items={activeCategory.items} 
                 fullWidth={!hasMainOffer && !hasSideOffers} 
               />
             </div>
          </div>

          {hasSideOffers && (
            <div className="col-span-3 h-full animate-in slide-in-from-bottom duration-1000 delay-300">
               <OffersSideArea items={activeCategory.items} />
            </div>
          )}

          {hasMainOffer && (
            <div className={`flex justify-end animate-in zoom-in duration-1000 delay-500 ${hasSideOffers ? 'col-span-3' : 'col-span-4'}`}>
              <OfferCard 
                itemName={activeCategory.offerItemName || (activeCategory.items[0]?.name || 'OFERTA')}
                price={activeCategory.offerPrice || (activeCategory.items[0]?.price || 0)}
                imageUrl={activeCategory.offerImage || ''}
              />
            </div>
          )}
        </main>

        <footer className="relative z-10 w-full px-16 py-10 flex justify-between items-end">
          <div className="flex gap-16 bg-black/70 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative">
             <div className="absolute top-0 left-0 w-full h-full bg-[#d61a1a]/5 rounded-[3.5rem] pointer-events-none"></div>
             <div className="flex flex-col relative z-10">
                <span className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-2">WhatsApp para Pedidos</span>
                <span className="text-white font-black text-5xl italic tracking-tighter drop-shadow-md">(99) 98410-3876</span>
             </div>
             <div className="w-px h-20 bg-white/10 relative z-10"></div>
             <div className="flex flex-col relative z-10">
                <span className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-2">Instagram</span>
                <span className="text-white font-black text-5xl tracking-tight drop-shadow-md">@smartpaguemenos</span>
             </div>
          </div>

          <div className={`flex gap-5 transition-all duration-700 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
            <button 
              onClick={() => setIsRemoteModalOpen(true)}
              className="flex items-center gap-4 bg-[#d61a1a] hover:bg-red-700 text-white px-10 py-6 rounded-[2.5rem] font-black uppercase text-sm tracking-widest shadow-[0_15px_40px_rgba(214,26,26,0.3)] active:scale-95 transition-all"
            >
              <Smartphone size={28} /> Painel Remoto
            </button>
            
            <button 
              onClick={() => setViewMode('admin')}
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 text-white px-10 py-6 rounded-[2.5rem] font-black uppercase text-sm tracking-widest border border-white/10 active:scale-95 transition-all"
            >
              <LayoutDashboard size={28} /> Configurar TV
            </button>

            <button 
              onClick={() => toggleTvMode()}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 py-6 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.25em] shadow-[0_15px_40px_rgba(250,204,21,0.2)] active:scale-95 transition-all"
            >
              {isTvMode ? 'Sair do Modo TV' : 'Expandir Modo TV'}
            </button>
          </div>
        </footer>

        {!showControls && isTvMode && (
          <div className="absolute bottom-8 right-8 text-white/10 animate-pulse flex items-center gap-3">
            <MonitorPlay size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Automação Inteligente Ativa</span>
          </div>
        )}
      </div>

      {viewMode === 'admin' && (
        <AdminPanel 
          categories={categories}
          onUpdateCategory={syncUpdate}
          onClose={() => setViewMode('display')}
          rotation={rotation}
          setRotation={setRotation}
          resolution={resolution}
          setResolution={setResolution}
          triggerSpin={triggerSpin}
        />
      )}

      {isRemoteModalOpen && (
        <RemoteAccessModal onClose={() => setIsRemoteModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
