
import React, { useState, useRef } from 'react';
import { Category, MenuItem } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  Settings, 
  Save, 
  X, 
  RotateCw, 
  ChevronRight, 
  Monitor, 
  Maximize2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Zap,
  ZapOff,
  ChevronDown,
  Layout,
  Upload,
  Trash2,
  Star,
  Wand2,
  Loader2
} from 'lucide-react';

interface AdminPanelProps {
  categories: Category[];
  onUpdateCategory: (category: Category) => void;
  onClose: () => void;
  rotation: number;
  setRotation: (deg: number) => void;
  resolution: 'auto' | '1080p' | '720p';
  setResolution: (res: 'auto' | '1080p' | '720p') => void;
  triggerSpin: () => void;
}

type AdminTab = 'general' | string;

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  categories, 
  onUpdateCategory, 
  onClose, 
  rotation, 
  setRotation,
  resolution,
  setResolution,
  triggerSpin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleItemUpdate = (catId: string, itemId: string, field: keyof MenuItem, value: any) => {
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          if (field === 'price' || field === 'originalPrice') {
            const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
            return { ...item, [field]: isNaN(numValue) ? 0 : numValue };
          }
          return { ...item, [field]: value };
        })
      };
    }));
  };

  const handleToggleVisibility = (catId: string, field: 'showMainOffer' | 'showSideOffers') => {
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, [field]: !cat[field] };
    }));
  };

  const handleOfferChange = (catId: string, field: 'offerItemName' | 'offerPrice' | 'offerImage', value: any) => {
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const newValue = field === 'offerPrice' ? parseFloat(value.toString().replace(',', '.')) : value;
      return { ...cat, [field]: newValue };
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeTab !== 'general') {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleOfferChange(activeTab, 'offerImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIImage = async () => {
    if (activeTab === 'general' || !activeCategoryData) return;

    try {
      // @ts-ignore - aistudio globals
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Assume key selection was successful to avoid delay
      }

      setIsGenerating(true);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const productName = activeCategoryData.offerItemName || 'Carne Selecionada';
      // Prompt solicitado pelo usuário
      const basePrompt = 'OFERTA IMBATÍVEL: Iluminação dramática e texturas de carne suculenta em 4K';
      const fullPrompt = `${basePrompt} para o produto ${productName}. Estilo de fotografia gastronômica de luxo, fundo escuro, realismo extremo.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "4K"
          }
        },
      });

      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        handleOfferChange(activeTab, 'offerImage', imageUrl);
      } else {
        console.warn('Nenhuma imagem retornada pela IA.');
      }
    } catch (error: any) {
      console.error('Erro ao gerar imagem:', error);
      if (error?.message?.includes("Requested entity was not found.")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const selectQuickOffer = (item: MenuItem) => {
    if (activeTab !== 'general') {
      handleOfferChange(activeTab, 'offerItemName', item.name);
      handleOfferChange(activeTab, 'offerPrice', item.price);
    }
  };

  const saveAll = () => {
    localCategories.forEach(onUpdateCategory);
    onClose();
  };

  const activeCategoryData = localCategories.find(c => c.id === activeTab);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-0 sm:p-4">
      <div className="bg-[#0a0a0a] w-full max-w-6xl h-full sm:h-[92vh] flex flex-col sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        
        <header className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Settings className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Gestão do Cardápio</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Painel Inteligente Smart Paguemenos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all text-gray-500 hover:text-white">
            <X size={32} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-64 border-r border-white/5 bg-[#0e0e0e] overflow-y-auto hidden md:block">
            <nav className="p-6 space-y-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm ${
                  activeTab === 'general' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <Monitor size={20} /> Geral
              </button>

              <div className="pt-6">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-4 mb-4">Categorias</p>
                {localCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-black text-sm mb-2 ${
                      activeTab === cat.id ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {activeTab === cat.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          <main className="flex-1 overflow-y-auto p-8">
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                       <RotateCw className="text-red-600" size={16} /> Rotação da Tela
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 90, 180, 270].map((deg) => (
                        <button key={deg} onClick={() => setRotation(deg)} className={`py-3 rounded-xl font-black transition-all border ${rotation === deg ? 'bg-red-600 text-white border-red-500' : 'bg-black text-gray-500 border-white/5'}`}>
                          {deg}º
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                       <Maximize2 className="text-red-600" size={16} /> Resolução
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(['auto', '1080p', '720p'] as const).map((res) => (
                        <button key={res} onClick={() => setResolution(res)} className={`py-3 rounded-xl font-black transition-all border uppercase ${resolution === res ? 'bg-red-600 text-white border-red-500' : 'bg-black text-gray-500 border-white/5'}`}>
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeCategoryData && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Layout size={14} className="text-red-600" /> Configurações de Layout
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleToggleVisibility(activeCategoryData.id, 'showMainOffer')}
                      className={`flex items-center justify-between gap-3 p-5 rounded-2xl font-black uppercase text-xs border transition-all ${activeCategoryData.showMainOffer ? 'bg-yellow-400 text-red-900 border-yellow-500 shadow-xl' : 'bg-white/5 text-gray-500 border-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        {activeCategoryData.showMainOffer ? <Eye size={20} /> : <EyeOff size={20} />}
                        <span>Banner de Destaque</span>
                      </div>
                      <span className="text-[10px] opacity-60 font-black">{activeCategoryData.showMainOffer ? 'ATIVO' : 'OCULTO'}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleToggleVisibility(activeCategoryData.id, 'showSideOffers')}
                      className={`flex items-center justify-between gap-3 p-5 rounded-2xl font-black uppercase text-xs border transition-all ${activeCategoryData.showSideOffers ? 'bg-red-600 text-white border-red-700 shadow-xl shadow-red-600/20' : 'bg-white/5 text-gray-500 border-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        {activeCategoryData.showSideOffers ? <Eye size={20} /> : <EyeOff size={20} />}
                        <span>Ofertas do Dia</span>
                      </div>
                      <span className="text-[10px] opacity-60 font-black">{activeCategoryData.showSideOffers ? 'ATIVO' : 'OCULTO'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Star size={14} className="text-yellow-400" /> Detalhes do Destaque Principal
                    </h3>
                    <div className="flex gap-2">
                      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[8px] font-bold text-gray-600 hover:text-gray-400 uppercase underline mt-1">Info Billing</a>
                      <button 
                        onClick={generateAIImage}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-yellow-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 active:scale-95"
                      >
                        {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                        {isGenerating ? 'Criando Imagem 4K...' : 'Gerar com IA (4K)'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-600 uppercase ml-1">Imagem da Oferta</label>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div 
                        onClick={() => !isGenerating && fileInputRef.current?.click()}
                        className={`relative w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 ${!isGenerating && 'hover:border-red-600/50 cursor-pointer'} bg-black flex flex-col items-center justify-center overflow-hidden transition-all group`}
                      >
                        {isGenerating && (
                          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 p-6">
                            <div className="relative">
                              <Loader2 className="text-yellow-400 animate-spin" size={56} />
                              <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-50" size={20} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">Gerando Obra Prima 4K</p>
                              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Prompt: Iluminação dramática e texturas suculentas</p>
                            </div>
                          </div>
                        )}
                        {activeCategoryData.offerImage ? (
                          <>
                            <img src={activeCategoryData.offerImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Preview" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="text-white mb-2" size={32} />
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">Enviar nova foto</span>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleOfferChange(activeCategoryData.id, 'offerImage', ''); }}
                              className="absolute top-4 right-4 bg-red-600 p-2 rounded-xl text-white hover:bg-red-700 transition-colors z-10"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-white transition-colors">
                            <Upload size={40} />
                            <div className="text-center px-4">
                              <span className="text-xs font-black uppercase tracking-widest">Sem Imagem</span>
                              <p className="text-[9px] mt-1 opacity-50 uppercase">Use o botão acima para gerar uma com IA ou clique aqui para subir</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-600 uppercase ml-2">Título do Banner</label>
                        <input 
                          className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-red-600 transition-colors"
                          value={activeCategoryData.offerItemName || ''}
                          onChange={(e) => handleOfferChange(activeCategoryData.id, 'offerItemName', e.target.value)}
                          placeholder="Ex: PICANHA PREMIUM ARGENTINA"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-600 uppercase ml-2">Preço Promocional (R$)</label>
                        <input 
                          type="number"
                          step="0.01"
                          className="w-full bg-black border border-white/10 p-4 rounded-2xl text-yellow-400 font-bold text-3xl outline-none focus:border-red-600 transition-colors"
                          value={activeCategoryData.offerPrice || 0}
                          onChange={(e) => handleOfferChange(activeCategoryData.id, 'offerPrice', e.target.value)}
                        />
                      </div>
                      <div className="pt-2">
                        <p className="text-[9px] font-black text-gray-700 uppercase mb-2 ml-1">Copiar dados da lista rápida:</p>
                        <div className="flex flex-wrap gap-2">
                          {activeCategoryData.items.slice(0, 5).map(item => (
                            <button 
                              key={item.id}
                              onClick={() => selectQuickOffer(item)}
                              className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-gray-400 uppercase border border-white/5 hover:border-white/10 transition-all"
                            >
                              + {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Layout size={14} className="text-red-600" /> Tabela Geral de Preços
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCategoryData.items.map(item => (
                      <div key={item.id} className="group bg-[#111] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-black text-white text-sm uppercase truncate flex-1">{item.name}</span>
                          <button 
                            onClick={() => handleItemUpdate(activeCategoryData.id, item.id, 'isOffer', !item.isOffer)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-[10px] font-black uppercase ${item.isOffer ? 'bg-yellow-400 text-red-900 shadow-lg shadow-yellow-400/10' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                          >
                            {item.isOffer ? <Zap size={14} fill="currentColor" /> : <ZapOff size={14} />}
                            {item.isOffer ? 'Oferta' : 'Normal'}
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-600 uppercase ml-1">De (R$)</label>
                            <input 
                              type="number"
                              step="0.01"
                              className="w-full bg-black border border-white/10 px-4 py-3 rounded-2xl text-xs font-bold text-gray-400 outline-none focus:border-white/30"
                              value={item.originalPrice || ''}
                              onChange={(e) => handleItemUpdate(activeCategoryData.id, item.id, 'originalPrice', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-yellow-600 uppercase ml-1">Por (R$)</label>
                            <input 
                              type="number"
                              step="0.01"
                              className="w-full bg-black border border-white/10 px-4 py-3 rounded-2xl text-xs font-bold text-yellow-400 outline-none focus:border-red-600"
                              value={item.price}
                              onChange={(e) => handleItemUpdate(activeCategoryData.id, item.id, 'price', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-600 uppercase ml-1">Unidade</label>
                            <select 
                                className="w-full bg-black border border-white/10 px-4 py-3 rounded-2xl text-xs font-bold text-white outline-none cursor-pointer"
                                value={item.unit}
                                onChange={(e) => handleItemUpdate(activeCategoryData.id, item.id, 'unit', e.target.value)}
                              >
                                <option value="kg">KG</option>
                                <option value="un">UN</option>
                                <option value="band">BAND</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        <footer className="px-8 py-5 border-t border-white/5 bg-[#111] flex justify-end gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-white transition-all text-sm uppercase">Cancelar</button>
          <button onClick={saveAll} className="flex items-center gap-3 bg-red-600 text-white px-10 py-4 rounded-xl font-black hover:bg-red-700 transition-all text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 active:scale-95">
            <Save size={20} /> Atualizar TV
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminPanel;
