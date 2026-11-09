import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Send, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function ScheduleModal({
  isOpen,
  onClose,
  partner,
  restaurant,
  restaurantsList = [],
  onSendInvite
}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurant || restaurantsList[0]);
  const [dateStr, setDateStr] = useState('Sexta-feira, 31 de Outubro');
  const [timeStr, setTimeStr] = useState('20:00');
  const [note, setNote] = useState('Bora experimentar os pratos deste lugar juntos? O cardápio parece incrível!');

  if (!isOpen) return null;

  const currentRes = restaurant || selectedRestaurant || restaurantsList[0];

  const handleQuickSelect = (date, time) => {
    setDateStr(date);
    setTimeStr(time);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentRes) return;

    onSendInvite({
      restauranteId: currentRes.id,
      restauranteNome: currentRes.nome,
      restauranteImagem: currentRes.imagemUrl,
      endereco: currentRes.endereco,
      dataEncontro: dateStr,
      horario: timeStr,
      mensagem: note,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <UtensilsCrossed size={16} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Agendar Encontro Gastronômico
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Convidar <strong>{partner?.nome || 'seu Match'}</strong> para jantar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Restaurante Escolhido */}
        <div className="mt-4 p-3 bg-rose-50/70 dark:bg-slate-800/80 rounded-2xl border border-rose-100 dark:border-slate-700 flex items-center gap-3">
          <img
            src={currentRes?.imagemUrl}
            alt={currentRes?.nome}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase">
                {currentRes?.categoria}
              </span>
              <span className="text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.2 rounded font-bold">
                {currentRes?.faixaPreco}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentRes?.nome}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
              <MapPin size={10} /> {currentRes?.endereco}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Seletor Rápido de Dias */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar size={13} className="text-rose-500" />
              Sugestões Rápidas:
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSelect('Sexta-feira, 31 de Out', '20:00')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center hover:border-rose-500 bg-white dark:bg-slate-800 font-medium"
              >
                Sexta • 20:00
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('Sábado, 01 de Nov', '19:30')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center hover:border-rose-500 bg-white dark:bg-slate-800 font-medium"
              >
                Sábado • 19:30
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('Domingo, 02 de Nov', '13:00')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center hover:border-rose-500 bg-white dark:bg-slate-800 font-medium"
              >
                Dom (Almoço)
              </button>
            </div>
          </div>

          {/* Data e Horário Manuais */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Data do Encontro:
              </label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="Ex: Sexta, 31 de Out"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Horário:
              </label>
              <input
                type="text"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                placeholder="Ex: 20:00"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          {/* Mensagem Personalizada */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mensagem de Convite:
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 resize-none text-slate-800 dark:text-slate-100"
              placeholder="Escreva algo gentil para animar o date..."
            />
          </div>

          {/* Botão de Envio */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/25 hover:opacity-95 flex items-center justify-center gap-2 transition"
            >
              <Send size={16} />
              Enviar Convite Interativo no Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
