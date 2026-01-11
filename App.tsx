
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
import { LayoutDashboard, Clock, Smartphone, Wifi, MousePointer2, MonitorPlay, Zap, AlertCircle, Tag, ArrowLeft, X } from 'lucide-react';

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
  const [isBooting, setIsBooting] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [initialAdminTab, setInitialAdminTab] = useState<string>('general');
  
  const [rotation, setRotation] = useState(0);
  const [resolution, setResolution] = useState<'auto' | '1080p' | '720p'>('auto');
  const [isSpinning, setIsSpinning] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInteraction = useCallback(() => {
    if (!isTvMode) return;
    
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isTvMode) setShowControls(false);
    }, 3000);
  }, [isTvMode]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const toggleTvMode = useCallback((forceState?: boolean) => {
    const newState = forceState !== undefined ? forceState : !isTvMode;
    
    if (newState) {
      // Início do boot visual indepentente da API de Fullscreen (previne tela escura se fullscreen falhar no APK)
      setIsBooting(true);
      setNeedsInteraction(false);

      const finalizeMode = () => {
        setIsTvMode(true);
        setShowControls(false);
        setIsBooting(false);
      };

      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
          .then(() => setTimeout(finalizeMode, 1500))
          .catch(() => {
            // Se falhar (comum em webviews bloqueados), apenas continua o modo TV visual
            setTimeout(finalizeMode, 1000);
          });
      } else {
        setTimeout(finalizeMode, 1000);
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsTvMode(false);
      setShowControls(true);
      setNeedsInteraction(false);
    }
  }, [isTvMode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<SyncMessage>) => {
      switch (event.data.type) {
        case 'UPDATE_CATEGORY':
          const updatedCat = event.data.payload;
          setCategories(prev => prev.map(cat => cat.id === updatedCat.id ? updatedCat : cat));
          if (viewMode === 'display') {
            setSyncToastMsg('Preços Atualizados');
            setShowSyncToast(true);
            setTimeout(() => setShowSyncToast(false), 3000);
          }
          break;
        case 'TOGGLE_TV':
          if (viewMode === 'display') toggleTvMode(event.data.payload);
          break;
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
    if (viewMode === 'display' && !isBooting && !needsInteraction) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % categories.length);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [viewMode, categories.length, isBooting, needsInteraction]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const layoutMetrics = useMemo(() => {
    // Valores padrão seguros para evitar NaN ou 0 que resultam em tela preta
    const targetW = resolution === 'auto' ? 1920 : (resolution === '1080p' ? 1920 : 1280);
    const targetH = resolution === 'auto' ? 1080 : (resolution === '1080p' ? 1080 : 720);
    const isPortrait = rotation === 90 || rotation === 270;
    const effectiveW = isPortrait ? targetH : targetW;
    const effectiveH = isPortrait ? targetW : targetH;
    
    // Cálculo de escala com proteção de valor mínimo (evita conteúdo invisível se windowSize for 0 momentaneamente)
    const scaleX = (windowSize.width || 1) / effectiveW;
    const scaleY = (windowSize.height || 1) / effectiveH;
    let scale = Math.min(scaleX, scaleY);

    if (isNaN(scale) || scale <= 0) scale = 0.5;

    return { 
      width: `${targetW}px`, 
      height: `${targetH}px`, 
      scale: isTvMode ? scale : Math.min(scale, 0.9)
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
    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    willChange: 'transform',
    opacity: isBooting ? 0 : 1,
  };

  const openAdmin = (tab: string) => {
    setInitialAdminTab(tab);
    setViewMode('admin');
  };

  if (viewMode === 'remote') return (
    <RemoteController 
      categories={categories} 
      onSync={syncUpdate} 
      onExit={() => setViewMode('display')} 
    />
  );

  const activeCategory = categories[currentIndex];
  const hasSidebar = activeCategory.showMainOffer || activeCategory.showSideOffers;

  return (
    <div 
      className="relative min-h-screen w-full bg-[#050505] overflow-hidden select-none"
      onMouseMove={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      
      {isTvMode && (
        <button 
          onClick={() => toggleTvMode(false)}
          className={`fixed top-8 left-8 z-[500] flex items-center gap-4 bg-red-600/90 hover:bg-red-600 text-white px-8 py-5 rounded-full font-black uppercase text-xl shadow-2xl transition-all duration-500 border-2 border-white/20 backdrop-blur-md active:scale-95 ${showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'}`}
        >
          <ArrowLeft size={32} strokeWidth={3} /> Sair do Modo TV
        </button>
      )}

      {needsInteraction && (
        <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center">
          <div className="bg-[#111] p-12 rounded-[3rem] border border-white/10 shadow-2xl max-w-xl">
            <AlertCircle className="text-yellow-400 mx-auto mb-6" size={80} />
            <h2 className="text-4xl font-black text-white uppercase mb-4">Ação Necessária</h2>
            <p className="text-gray-400 text-lg mb-8">Clique abaixo para ativar o modo de tela cheia e sincronização de TV.</p>
            <button 
              onClick={() => toggleTvMode(true)}
              className="bg-[#d61a1a] text-white px-16 py-6 rounded-2xl font-black uppercase text-xl shadow-2xl transition-all active:scale-95"
            >
              Ativar Painel TV
            </button>
          </div>
        </div>
      )}

      {isBooting && (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center gap-8">
           <Logo size="xl" />
           <div className="flex flex-col items-center gap-2">
             <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-red-600 animate-[loading_1.5s_ease-in-out]"></div>
             </div>
             <span className="text-xs font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Sincronizando Sistema</span>
           </div>
        </div>
      )}

      {showSyncToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[250] bg-[#d61a1a] text-white px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-6 animate-in slide-in-from-top-12 duration-500">
           <Zap size={24} className="text-yellow-400 fill-yellow-400" />
           <span className="text-2xl">{syncToastMsg}</span>
        </div>
      )}

      <div style={rotationStyle} className="flex flex-col bg-meat-table shadow-[0_0_150px_rgba(0,0,0,1)] rounded-sm">
        <header className="relative z-10 w-full pt-14 pb-6 px-16">
          <div className="bg-black/70 backdrop-blur-3xl px-12 py-8 rounded-[3.5rem] flex justify-between items-center border border-white/10 shadow-3xl">
            <div className="flex items-center gap-12">
              <Logo size="lg" />
              <div>
                <h1 className="text-8xl font-oswald font-black text-white tracking-tighter uppercase leading-none">
                  Smart <span className="text-yellow-500">PAGUE MENOS</span>
                </h1>
                <p className="text-2xl font-bold text-red-500 tracking-[0.5em] uppercase mt-2">Tecnologia e Qualidade</p>
              </div>
            </div>

            <div className="flex items-center gap-14">
              <div className="flex flex-col items-center bg-white/5 px-12 py-6 rounded-[2.5rem] border border-white/10">
                 <div className="flex items-center gap-5 text-white">
                   <Clock size={40} className="text-yellow-400" />
                   <span className="text-7xl font-black font-oswald">
                     {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                   </span>
                 </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-green-500 uppercase flex items-center justify-end gap-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span> ONLINE
                </span>
                <p className="text-xs font-bold text-white/30 uppercase mt-2">SISTEMA ATIVO 4K</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative z-10 w-full px-16 py-8 grid grid-cols-12 gap-12 items-start overflow-hidden">
          <div className={`${hasSidebar ? 'col-span-8' : 'col-span-12'} flex flex-col space-y-10`}>
             <div className="flex items-center gap-8">
                <div className="h-28 w-8 bg-[#d61a1a] rounded-full shadow-lg"></div>
                <h2 className="text-[10rem] font-oswald font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">
                  {activeCategory.label}
                </h2>
             </div>
             <PriceList items={activeCategory.items} fullWidth={!hasSidebar} />
          </div>

          {hasSidebar && (
            <div className="col-span-4 h-full flex flex-col gap-10 pt-10">
              {activeCategory.showMainOffer && (
                <OfferCard 
                  itemName={activeCategory.offerItemName || activeCategory.items[0].name}
                  price={activeCategory.offerPrice || activeCategory.items[0].price}
                  imageUrl={activeCategory.offerImage || ''}
                />
              )}
              {activeCategory.showSideOffers && (
                <OffersSideArea items={activeCategory.items} />
              )}
            </div>
          )}
        </main>

        <footer className="relative z-10 w-full px-16 py-12 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex gap-12 bg-black/60 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10">
             <div>
                <span className="text-sm font-black text-yellow-500 uppercase tracking-widest block mb-2">WhatsApp</span>
                <span className="text-6xl font-black text-white italic tracking-tighter">(99) 98410-3876</span>
             </div>
             <div className="w-px h-24 bg-white/10"></div>
             <div>
                <span className="text-sm font-black text-yellow-500 uppercase tracking-widest block mb-2">Instagram</span>
                <span className="text-6xl font-black text-white tracking-tight">@smartpaguemenos</span>
             </div>
          </div>

          <div className={`flex gap-6 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
            <button 
              onClick={() => setIsRemoteModalOpen(true)}
              className="bg-[#d61a1a] text-white px-10 py-7 rounded-[3rem] font-black uppercase text-lg shadow-2xl flex items-center gap-4 transition-all active:scale-95"
            >
              <Smartphone size={30} /> Remoto
            </button>

            <button 
              onClick={() => openAdmin('promotions')}
              className="bg-yellow-400 text-red-900 px-10 py-7 rounded-[3rem] font-black uppercase text-lg shadow-2xl flex items-center gap-4 transition-all active:scale-95 border-b-4 border-yellow-600"
            >
              <Tag size={30} /> Ofertas & Promoções
            </button>

            <button 
              onClick={() => openAdmin('general')}
              className="bg-white/10 text-white px-10 py-7 rounded-[3rem] font-black uppercase text-lg border border-white/20 transition-all active:scale-95"
            >
              <LayoutDashboard size={30} /> Setup
            </button>

            <button 
              onClick={() => toggleTvMode()}
              className="bg-red-600 text-white px-12 py-7 rounded-[3rem] font-black uppercase text-lg shadow-2xl transition-all active:scale-95 border-b-4 border-red-800"
            >
              {isTvMode ? 'Sair TV' : 'Modo TV'}
            </button>
          </div>
        </footer>
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
          triggerSpin={() => {setIsSpinning(true); setTimeout(() => setIsSpinning(false), 1000);}}
          initialTab={initialAdminTab}
        />
      )}

      {isRemoteModalOpen && (
        <RemoteAccessModal onClose={() => setIsRemoteModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
