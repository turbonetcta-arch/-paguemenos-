
import React, { useState } from 'react';
import { Category, MenuItem } from '../types';
import { 
  Settings, 
  Save, 
  X, 
  RotateCw, 
  RefreshCw, 
  ChevronRight, 
  LayoutGrid, 
  Tag, 
  Monitor, 
  Clock,
  Trash2,
  Plus
} from 'lucide-react';

interface AdminPanelProps {
  categories: Category[];
  onUpdateCategory: (category: Category) => void;
  onClose: () => void;
  rotation: number;
  setRotation: (deg: number) => void;
  triggerSpin: () => void;
}

type AdminTab = 'general' | string; // 'general' ou ID da categoria

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  categories, 
  onUpdateCategory, 
  onClose, 
  rotation, 
  setRotation,
  triggerSpin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);

  const handlePriceChange = (catId: string, itemId: string, newPrice: string) => {
    const price = parseFloat(newPrice.replace(',', '.'));
    if (isNaN(price)) return;

    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => item.id === itemId ? { ...item, price } : item)
      };
    }));
  };

  const handleOfferChange = (catId: string, field: 'offerItemName' | 'offerPrice', value: string) => {
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const newValue = field === 'offerPrice' ? parseFloat(value.replace(',', '.')) : value;
      return { ...cat, [field]: newValue };
    }));
  };

  const saveAll = () => {
    localCategories.forEach(onUpdateCategory);
    onClose();
  };

  const activeCategoryData = localCategories.find(c => c.id === activeTab);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-0 sm:p-4">
      <div className="bg-[#121212] w-full max-w-6xl h-full sm:h-[85vh] flex flex-col sm:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Área do Administrador</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Controle Total do Menu Digital</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar */}
          <aside className="w-64 border-r border-white/5 bg-[#161616] overflow-y-auto hidden md:block">
            <nav className="p-4 space-y-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 mb-2">Geral</p>
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === 'general' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <Monitor size={18} /> Configurações de Tela
              </button>

              <div className="pt-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 mb-2">Categorias de Preço</p>
                {localCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm mb-1 ${
                      activeTab === cat.id ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Tag size={18} className={activeTab === cat.id ? 'text-red-600' : ''} />
                      <span className="truncate">{cat.label}</span>
                    </div>
                    {activeTab === cat.id && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#121212]">
            
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section>
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase italic">
                    <Monitor className="text-red-600" /> Ajustes do Monitor
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block">Orientação da Tela</label>
                      <div className="flex gap-2">
                        {[0, 90, 180, 270].map((deg) => (
                          <button
                            key={deg}
                            onClick={() => setRotation(deg)}
                            className={`flex-1 py-3 rounded-xl font-black transition-all border ${
                              rotation === deg 
                                ? 'bg-red-600 text-white border-red-600 shadow-xl' 
                                : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                          >
                            {deg}º
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-4 italic font-bold">
                        Dica: Use 90º ou 270º para TVs instaladas na vertical (Retrato).
                      </p>
                    </div>

                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block">Efeitos de Transição</label>
                        <button
                          onClick={triggerSpin}
                          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-black hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
                        >
                          <RefreshCw size={18} /> TESTAR GIRO 360º
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                   <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={16} className="text-red-600" /> Tempo de Carrossel
                   </h4>
                   <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="5" 
                        max="60" 
                        defaultValue="15" 
                        className="flex-1 accent-red-600"
                      />
                      <span className="bg-black px-4 py-2 rounded-lg font-black text-red-500 border border-white/5">15s</span>
                   </div>
                </section>
              </div>
            )}

            {/* Category Tab */}
            {activeCategoryData && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                      {activeCategoryData.label}
                    </h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      Editando {activeCategoryData.items.length} itens desta categoria
                    </p>
                  </div>
                </header>

                {/* Offer Highlighting Section */}
                <section className="bg-red-600/10 p-6 rounded-2xl border border-red-600/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Tag size={100} />
                  </div>
                  <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <LayoutGrid size={14} /> Destaque de Oferta Principal
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase ml-1">Produto em Destaque</span>
                      <input 
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl font-bold text-white focus:border-red-600 transition-colors"
                        value={activeCategoryData.offerItemName || ''}
                        onChange={(e) => handleOfferChange(activeCategoryData.id, 'offerItemName', e.target.value)}
                        placeholder="Ex: Picanha Especial"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase ml-1">Preço da Oferta (R$)</span>
                      <input 
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl font-black text-red-500 focus:border-red-600 transition-colors"
                        value={activeCategoryData.offerPrice || 0}
                        onChange={(e) => handleOfferChange(activeCategoryData.id, 'offerPrice', e.target.value)}
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                </section>

                {/* Items List */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Tabela de Preços</h4>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {activeCategoryData.items.map(item => (
                      <div key={item.id} className="group flex items-center gap-4 p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:border-white/20 transition-all">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nome do Item</label>
                          <span className="font-black text-white text-sm uppercase truncate block">{item.name}</span>
                        </div>
                        <div className="w-32">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Preço (kg/un)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-gray-600">R$</span>
                            <input 
                              type="number"
                              step="0.01"
                              className="w-full bg-black border border-white/10 p-2 pl-9 rounded-xl text-right font-black text-white focus:border-red-600 transition-colors"
                              value={item.price}
                              onChange={(e) => handlePriceChange(activeCategoryData.id, item.id, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button className="flex items-center justify-center gap-2 p-4 bg-dashed border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-white hover:border-white/30 transition-all group">
                       <Plus size={20} className="group-hover:scale-110 transition-transform" />
                       <span className="text-xs font-black uppercase tracking-widest">Adicionar Novo Produto</span>
                    </button>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="px-6 py-5 border-t border-white/5 bg-[#1a1a1a] flex justify-between items-center">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:block">
            * Todas as alterações são salvas localmente nesta sessão
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button 
              onClick={saveAll}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-3 rounded-xl font-black hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPanel;
