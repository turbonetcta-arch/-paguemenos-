
import React from 'react';
import { X, Smartphone, QrCode, Share2, Copy, Check } from 'lucide-react';

interface RemoteAccessModalProps {
  onClose: () => void;
}

const RemoteAccessModal: React.FC<RemoteAccessModalProps> = ({ onClose }) => {
  const [copied, setCopied] = React.useState(false);
  
  // Adiciona o parâmetro mode=remote ao link para que o celular abra a interface correta
  const baseUrl = window.location.href.split('?')[0];
  const remoteUrl = `${baseUrl}?mode=remote`;
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(remoteUrl)}&bgcolor=FFFFFF&color=000000&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(remoteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#111] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col items-center">
        
        <header className="w-full px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl">
              <Smartphone className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Acesso Remoto</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </header>

        <div className="p-10 flex flex-col items-center text-center space-y-8">
          <div className="relative group">
            <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-full group-hover:bg-red-600/30 transition-all duration-500"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-2xl scale-100 hover:scale-105 transition-transform duration-500">
              <img 
                src={qrUrl} 
                alt="QR Code para Acesso Remoto" 
                className="w-48 h-48"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-[2px] pointer-events-none">
                <QrCode size={40} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-white font-black text-lg uppercase tracking-tight">
              Aponte a câmera do seu celular
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
              Escaneie o código acima para gerenciar os preços e ofertas diretamente do seu smartphone. A TV atualizará na hora!
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-black/50 border border-white/5 p-3 rounded-2xl">
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-left ml-1 mb-1">Link de Controle</p>
                <p className="text-white text-xs truncate font-mono opacity-60 px-1">{remoteUrl}</p>
              </div>
              <button 
                onClick={handleCopy}
                className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 transition-all active:scale-95"
            >
              Começar Automação
            </button>
          </div>
        </div>

        <div className="w-full bg-black/40 py-4 px-8 border-t border-white/5 text-center">
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <Share2 size={10} /> Canal de Automação Ativo
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemoteAccessModal;
