
import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Layout,
  Upload,
  Trash2,
  Star,
  Wand2,
  Loader2,
  Tag,
  TrendingDown,
  ChevronLeft,
  Activity,
  Cpu,
  Columns,
  Tv,
  Plus,
  PackagePlus,
  Check,
  Sparkles
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
  initialTab?: string;
}

type AdminTab = 'general' | 'promotions' | string;

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  categories, 
  onUpdateCategory, 
  onClose, 
  rotation, 
  setRotation,
  resolution,
  setResolution,
  triggerSpin,
  initialTab = 'general'
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddOfferForm, setShowAddOfferForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for new offer
  const [newOfferData, setNewOfferData] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    unit: 'kg' as 'kg' | 'un' | 'band',
    catId: categories[0]?.id || ''
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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

  const handleAddNewItem = (catId: string) => {
    const newItem: MenuItem = {
      id: `new-${Date.now()}`,
      name: 'NOVO PRODUTO',
      price: 0,
      unit: 'kg',
      isOffer: false
    };

    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: [newItem, ...cat.items]
      };
    }));
  };

  const handleCreateOfferFromForm = () => {
    if (!newOfferData.name || newOfferData.price <= 0) return;

    const newItem: MenuItem = {
      id: `offer-${Date.now()}`,
      name: newOfferData.name.toUpperCase(),
      price: newOfferData.price,
      originalPrice: newOfferData.originalPrice > 0 ? newOfferData.originalPrice : undefined,
      unit: newOfferData.unit,
      isOffer: true
    };

    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== newOfferData.catId) return cat;
      return {
        ...cat,
        items: [newItem, ...cat.items]
      };
    }));

    // Reset form
    setNewOfferData({
      name: '',
      price: 0,
      originalPrice: 0,
      unit: 'kg',
      catId: categories[0]?.id || ''
    });
    setShowAddOfferForm(false);
  };

  const handleDeleteItem = (catId: string, itemId: string) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.filter(item => item.id !== itemId)
      };
    }));
  };

  const handleOfferChange = (catId: string, field: 'offerItemName' | 'offerPrice' | 'offerImage', value: any) => {
    setLocalCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const newValue = field === 'offerPrice' ? parseFloat(value.toString().replace(',', '.')) : value;
      return { ...cat, [field]: newValue };
    }));
  };

  const handleToggleGlobalSideOffers = () => {
    const currentState = localCategories[0]?.showSideOffers ?? true;
    setLocalCategories(prev => prev.map(cat => ({
      ...cat,
      showSideOffers: !currentState
    })));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeTab !== 'general' && activeTab !== 'promotions') {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleOfferChange(activeTab, 'offerImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIImage = async () => {
    if (activeTab === 'general' || activeTab === 'promotions') return;

    try {
      setIsGenerating(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const activeCat = localCategories.find(c => c.id === activeTab);
      const productName = activeCat?.offerItemName || 'Carne Selecionada';
      const fullPrompt = `Gere uma foto profissional e suculenta para cardápio digital de um açougue. Produto: ${productName}. Iluminação de estúdio, fundo escuro elegante, alta resolução 4K.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
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

      if (imageUrl) handleOfferChange(activeTab, 'offerImage', imageUrl);
    } catch (error: any) {
      console.error('Erro ao gerar imagem:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePromotionalAIImage = async () => {
    try {
      setIsGenerating(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = 'OFERTA IMBATÍVEL: Iluminação dramática e texturas de carne suculenta em 4K';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
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

      // Aplica a imagem gerada ao primeiro departamento como banner de "oferta geral" 
      // ou a todos os departamentos que não possuem imagem.
      if (imageUrl) {
        setLocalCategories(prev => prev.map((cat, idx) => {
          if (idx === 0 || !cat.offerImage) {
             return { ...cat, offerImage: imageUrl };
          }
          return cat;
        }));
        alert('Imagem de destaque geral gerada e aplicada aos departamentos!');
      }
    } catch (error: any) {
      console.error('Erro ao gerar imagem de promoção:', error);
      alert('Falha ao gerar imagem. Verifique sua chave de API.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAll = () => {
    localCategories.forEach(cat => onUpdateCategory(cat));
    onClose();
  };

  const activeCategoryData = localCategories.find(c => c.id === activeTab);
  const isSideOffersActive = localCategories[0]?.showSideOffers ?? true;

  const allPromotionalItems = localCategories.flatMap(cat => 
    cat.items.map(item => ({ ...item, catId: cat.id, catLabel: cat.label }))
  ).filter(item => item.isOffer || (item.originalPrice && item.originalPrice > item.price));

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-0 sm:p-4">
      <div className="bg-[#0a0a0a] w-full max-w-6xl h-full sm:h-[92vh] flex flex-col sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        
        <header className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Settings className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Configurações</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Smart Pague Menos v2.5</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={saveAll} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-green-700 transition-all shadow-lg active:scale-95">
              <Save size={18} /> Salvar Alterações
            </button>
            <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full transition-all text-gray-500">
              <X size={32} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-64 border-r border-white/5 bg-[#0e0e0e] overflow-y-auto hidden md:block">
            <nav className="p-6 space-y-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm ${
                  activeTab === 'general' ? 'bg-white text-black shadow-xl' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <Monitor size={20} /> Exibição
              </button>

              <button
                onClick={() => setActiveTab('promotions')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm ${
                  activeTab === 'promotions' ? 'bg-yellow-400 text-red-900 shadow-xl' : 'text-yellow-500/80 hover:bg-white/5'
                }`}
              >
                <Tag size={20} /> Promoções
              </button>

              <div className="pt-8">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] px-4 mb-4">Departamentos</p>
                {localCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-black text-sm mb-2 ${
                      activeTab === cat.id ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    <ChevronRight size={16} className={activeTab === cat.id ? 'opacity-100' : 'opacity-0'} />
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          <main className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a] custom-scrollbar">
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                     <Monitor className="text-red-600" size={28} /> Geral & Exibição
                   </h2>
                </div>

                {/* Hardware & Display Config Group */}
                <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Rotation Group */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20">
                          <RotateCw className="text-red-600" size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Orientação</h3>
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Girar Tela da TV</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 90, 180, 270].map((deg) => (
                          <button 
                            key={deg} 
                            onClick={() => { setRotation(deg); triggerSpin(); }} 
                            className={`py-4 rounded-xl font-black text-sm transition-all border-2 ${rotation === deg ? 'bg-red-600 text-white border-red-400 shadow-lg' : 'bg-black text-gray-500 border-white/5 hover:border-white/10'}`}
                          >
                            {deg}º
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resolution Group */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                          <Maximize2 className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Resolução</h3>
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Qualidade de Vídeo</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['auto', '1080p', '720p'] as const).map((res) => (
                          <button 
                            key={res} 
                            onClick={() => setResolution(res)} 
                            className={`py-4 rounded-xl font-black text-sm transition-all border-2 uppercase ${resolution === res ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-black text-gray-500 border-white/5 hover:border-white/10'}`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interface Layout Config Group */}
                <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-orange-600/10 rounded-2xl border border-orange-600/20">
                      <Layout className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Interface & Componentes</h3>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Alternar elementos visuais</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={handleToggleGlobalSideOffers}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isSideOffersActive ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-black border-white/5 text-gray-500'}`}
                    >
                      <div className="flex items-center gap-4">
                        <Columns size={20} className={isSideOffersActive ? 'text-white' : 'text-gray-600'} />
                        <div className="text-left">
                          <span className="block font-black uppercase text-xs">Área de Ofertas Lateral</span>
                          <span className="block text-[8px] uppercase font-bold opacity-70 tracking-tighter">Lista extra de promoções do dia</span>
                        </div>
                      </div>
                      {isSideOffersActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'promotions' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                     <TrendingDown className="text-yellow-400" size={32} /> Central de Ofertas
                   </h2>
                   
                   <div className="flex items-center gap-3">
                     <button 
                       onClick={generatePromotionalAIImage}
                       disabled={isGenerating}
                       className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                     >
                       {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                       Gerar Imagem IA
                     </button>

                     <button 
                       onClick={() => setShowAddOfferForm(!showAddOfferForm)}
                       className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all shadow-lg active:scale-95"
                     >
                       {showAddOfferForm ? <X size={20} /> : <Plus size={20} />}
                       {showAddOfferForm ? 'Cancelar' : 'Criar Nova Oferta'}
                     </button>
                   </div>
                </div>

                {showAddOfferForm && (
                  <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-[2.5rem] animate-in zoom-in-95 duration-300">
                    <h3 className="text-xl font-black text-emerald-400 uppercase mb-6 flex items-center gap-3">
                      <PackagePlus size={24} /> Nova Oferta Rápida
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-400/60 uppercase px-2">Departamento</label>
                        <select 
                          className="w-full bg-black border border-emerald-500/20 p-4 rounded-xl text-white font-bold focus:border-emerald-500 outline-none"
                          value={newOfferData.catId}
                          onChange={(e) => setNewOfferData({...newOfferData, catId: e.target.value})}
                        >
                          {localCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-400/60 uppercase px-2">Nome do Produto</label>
                        <input 
                          type="text"
                          className="w-full bg-black border border-emerald-500/20 p-4 rounded-xl text-white font-bold focus:border-emerald-500 outline-none uppercase"
                          placeholder="EX: MAMINHA"
                          value={newOfferData.name}
                          onChange={(e) => setNewOfferData({...newOfferData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-400/60 uppercase px-2">Preço de Oferta</label>
                        <input 
                          type="number"
                          className="w-full bg-black border border-emerald-500/20 p-4 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                          placeholder="0.00"
                          value={newOfferData.price || ''}
                          onChange={(e) => setNewOfferData({...newOfferData, price: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={handleCreateOfferFromForm}
                          className="w-full bg-emerald-500 text-black px-8 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl"
                        >
                          <Check size={18} /> Confirmar Oferta
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {allPromotionalItems.map(item => (
                    <div key={`${item.catId}-${item.id}`} className="bg-[#111] border border-white/5 rounded-[2rem] p-8 border-l-8 border-yellow-400 shadow-xl group hover:border-white/10 transition-all relative">
                      <button 
                        onClick={() => handleDeleteItem(item.catId, item.id)}
                        className="absolute top-4 right-4 p-2 text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1 block">{item.catLabel}</span>
                          <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">{item.name}</h4>
                        </div>
                        <button 
                          onClick={() => handleItemUpdate(item.catId, item.id, 'isOffer', !item.isOffer)}
                          className={`p-3 rounded-2xl transition-all shadow-lg ${item.isOffer ? 'bg-yellow-400 text-red-900' : 'bg-white/5 text-gray-500'}`}
                        >
                          <Zap size={24} fill={item.isOffer ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Preço Normal</label>
                          <input 
                            type="number"
                            className="w-full bg-black border border-white/10 p-4 rounded-xl text-white font-bold focus:border-red-600 transition-colors"
                            value={item.originalPrice || ''}
                            onChange={(e) => handleItemUpdate(item.catId, item.id, 'originalPrice', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em] block mb-2">Preço Promo</label>
                          <input 
                            type="number"
                            className="w-full bg-black border border-yellow-400/20 p-4 rounded-xl text-yellow-400 font-bold focus:border-yellow-400 transition-colors"
                            value={item.price}
                            onChange={(e) => handleItemUpdate(item.catId, item.id, 'price', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {allPromotionalItems.length === 0 && !showAddOfferForm && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-40">
                       <Tag size={64} className="mb-4" />
                       <p className="font-black uppercase tracking-widest text-sm">Nenhuma oferta ativa no momento</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeCategoryData && activeTab !== 'promotions' && activeTab !== 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-yellow-400/10 rounded-2xl">
                         <Star size={24} className="text-yellow-400" />
                       </div>
                       <div>
                         <h3 className="text-xl font-black text-white uppercase tracking-tight">Destaque de {activeCategoryData.label}</h3>
                         <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Banner Principal da Categoria</p>
                       </div>
                    </div>
                    <button 
                      onClick={generateAIImage}
                      disabled={isGenerating}
                      className="flex items-center gap-3 bg-gradient-to-br from-red-600 to-red-800 text-white px-6 py-4 rounded-2xl text-[11px] font-black uppercase disabled:opacity-50 shadow-xl active:scale-95 transition-all"
                    >
                      {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                      {isGenerating ? 'IA está gerando...' : 'Gerar Foto com IA'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5 space-y-4">
                      <div className="aspect-square rounded-[2rem] bg-black border border-white/10 overflow-hidden relative group cursor-pointer shadow-2xl" onClick={() => fileInputRef.current?.click()}>
                        {activeCategoryData.offerImage ? (
                          <img src={activeCategoryData.offerImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Upload size={48} className="mb-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Fazer Upload de Foto</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                           <Upload className="text-white" size={32} />
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                      </div>
                    </div>
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                      <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-3">Nome do Produto em Destaque</label>
                        <input 
                          className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-black text-xl uppercase focus:border-red-600 transition-colors"
                          placeholder="EX: PICANHA ARGENTINA"
                          value={activeCategoryData.offerItemName || ''}
                          onChange={(e) => handleOfferChange(activeCategoryData.id, 'offerItemName', e.target.value)}
                        />
                      </div>
                      <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                        <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest block mb-3">Preço da Oferta de Destaque</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500 font-black text-2xl">R$</span>
                          <input 
                            type="number"
                            className="w-full bg-black border border-yellow-400/20 pl-14 p-5 rounded-2xl text-yellow-400 font-black text-4xl focus:border-yellow-400 transition-colors"
                            value={activeCategoryData.offerPrice || 0}
                            onChange={(e) => handleOfferChange(activeCategoryData.id, 'offerPrice', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 pb-8">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Itens da Tabela de Preços</h3>
                    <button 
                      onClick={() => handleAddNewItem(activeCategoryData.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                      <Plus size={16} /> Adicionar Produto
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCategoryData.items.map(item => (
                      <div key={item.id} className="bg-[#111] p-6 rounded-[1.5rem] border border-white/5 flex flex-col gap-4 group hover:border-white/10 transition-colors relative">
                        <button 
                          onClick={() => handleDeleteItem(activeCategoryData.id, item.id)}
                          className="absolute top-2 right-2 p-2 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex justify-between items-start">
                          <input 
                            type="text"
                            className="bg-transparent border-none p-0 text-base font-black text-white uppercase tracking-tight leading-tight flex-1 mr-4 focus:ring-0 outline-none"
                            value={item.name}
                            onChange={(e) => handleItemUpdate(activeCategoryData.id, item.id, 'name', e.target.value.toUpperCase())}
                          />
                          <button 
                            onClick={() => handleItemUpdate(activeCategoryData.id, item.id, 'isOffer', !item.isOffer)}
                            className={`p-2 rounded-xl shadow-md transition-all ${item.isOffer ? 'bg-yellow-400 text-red-900' : 'bg-white/5 text-gray-600 hover:text-white'}`}
                          >
                            <Zap size={16} fill={item.isOffer ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500">R$</span>
                            <input 
                              type="number"
                              className="w-full bg-black border border-white/10 pl-8 p-3 rounded-xl text-sm font-bold text-white focus:border-red-600 transition-colors"
                              value={item.price}
                              onChange={(e) => handleItemUpdate(activeCategoryData.id, item.id, 'price', e.target.value)}
                            />
                          </div>
                          <select 
                            className="bg-black border border-white/10 p-3 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest focus:border-red-600"
                            value={item.unit}
                            onChange={(e) => handleItemUpdate(activeCategoryData.id, item.id, 'unit', e.target.value)}
                          >
                            <option value="kg">POR KG</option>
                            <option value="un">POR UN</option>
                            <option value="band">BANDEJA</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
