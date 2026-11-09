import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, UtensilsCrossed, MessageCircle, X } from 'lucide-react';

export default function MatchModal({ matchUser, currentUser, onClose, onOpenChat, onOpenSchedule }) {
  useEffect(() => {
    // Dispara confetes coloridos festivos
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f97316', '#fbbf24', '#ffffff']
      });
    } catch (err) {
      console.log('Confetti effect triggered');
    }
  }, []);

  if (!matchUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-rose-500/30 text-center overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 transition"
        >
          <X size={18} />
        </button>

        {/* Badge Festivo */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider mb-3">
          <span>🍕</span> Conexão Gastronômica!
        </div>

        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300">
          DEU MATCH!
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
          Você e <strong>{matchUser.nome}</strong> têm o mesmo apetite por boa comida!
        </p>

        {/* Fotos dos Usuários com Coração Central */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-lg shadow-rose-500/30 rotate-[-4deg]">
            <img
              src={currentUser.fotoPerfil}
              alt={currentUser.nome}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg animate-bounce">
            <Heart size={20} className="fill-white" />
          </div>

          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/30 rotate-[4deg]">
            <img
              src={matchUser.fotoPerfil}
              alt={matchUser.nome}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Destaque das Afinidades */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-6 text-left">
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
            🍽️ Afinidades em comum:
          </p>
          <p className="text-xs font-semibold text-rose-300 mt-0.5">
            {matchUser.culinariasEmComum ? matchUser.culinariasEmComum.join(' • ') : 'Culinária Italiana e Cafés Especiais'}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              if (onOpenSchedule) onOpenSchedule(matchUser);
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/40 hover:opacity-95 flex items-center justify-center gap-2 transition"
          >
            <UtensilsCrossed size={18} />
            Convidar para um Restaurante
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenChat) onOpenChat(matchUser);
            }}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition border border-white/10"
          >
            <MessageCircle size={18} />
            Mandar Mensagem no Chat
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Continuar Descobrindo
          </button>
        </div>
      </div>
    </div>
  );
}
