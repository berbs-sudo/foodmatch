import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Send, UtensilsCrossed, Check, X, RotateCcw, Clock, Calendar, MapPin, Sparkles, Phone, Video } from 'lucide-react';

export default function ChatView({
  matches,
  selectedMatch,
  setSelectedMatch,
  messages,
  onSendMessage,
  onOpenScheduleModal,
  onUpdateInviteStatus,
  invites = []
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const activeMatch = selectedMatch || matches[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeMatch]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatch) return;

    onSendMessage(activeMatch.id, inputText);
    setInputText('');
  };

  const sendIcebreaker = (phrase) => {
    if (!activeMatch) return;
    onSendMessage(activeMatch.id, phrase);
  };

  const handleAcceptInvite = (inviteId) => {
    onUpdateInviteStatus(inviteId, 'ACCEPTED');
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6']
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  if (!activeMatch) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">💬</p>
        <h3 className="text-lg font-bold">Nenhuma conversa selecionada</h3>
        <p className="text-xs text-slate-400">Dê like em alguém no feed para começar a conversar!</p>
      </div>
    );
  }

  // Encontra os convites deste match
  const matchInvites = invites.filter((i) => i.matchId === activeMatch.id);

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Barra Horizontal de Novos Matches */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 overflow-x-auto hide-scrollbar">
        <span className="text-[10px] uppercase font-black tracking-wider text-rose-500 whitespace-nowrap">
          Seus Matches:
        </span>
        {matches.map((m) => {
          const isSelected = m.id === activeMatch.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMatch(m)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-2xl transition whitespace-nowrap ${
                isSelected
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <img
                src={m.partner?.fotoPerfil}
                alt={m.partner?.nome}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-bold">{m.partner?.nome.split(' ')[0]}</span>
              <span className="text-[10px] opacity-80">{m.compatibilidade}% 🔥</span>
            </button>
          );
        })}
      </div>

      {/* Header do Chat com Botão "Convidar para Sair" */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeMatch.partner?.fotoPerfil}
              alt={activeMatch.partner?.nome}
              className="w-10 h-10 rounded-full object-cover border border-rose-300"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{activeMatch.partner?.nome}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold">
                {activeMatch.partner?.idade} anos
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              Ama {activeMatch.partner?.pratoFavorito || 'comida boa'}
            </p>
          </div>
        </div>

        {/* Botão de Destaque: "Convidar para Sair" */}
        <button
          onClick={() => onOpenScheduleModal(activeMatch.partner)}
          className="px-3.5 py-2 bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-500/25 hover:opacity-95 transition"
        >
          <UtensilsCrossed size={14} />
          <span>Convidar para Sair</span>
        </button>
      </div>

      {/* Mensagens e Cards Interativos de Convite */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
        {/* Aviso de Afinidade no Topo */}
        <div className="text-center my-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-[11px] font-semibold text-rose-600 dark:text-rose-300 rounded-full">
            <Sparkles size={12} />
            Vocês dois deram match gastronômico! Ambos adoram comida boa.
          </span>
        </div>

        {/* Renderiza Mensagens */}
        {messages.map((msg) => {
          const isMine = msg.senderId === 1; // 1 é o usuário logado
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isMine
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-br-none shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                <p>{msg.texto}</p>
                <span
                  className={`text-[9px] block text-right mt-1 font-medium ${
                    isMine ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  {msg.horario || 'Agora'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Card Interativo de Convite de Encontro (O "Card de Agendamento") */}
        {matchInvites.map((invite) => {
          const isAccepted = invite.status === 'ACCEPTED';
          const isRejected = invite.status === 'REJECTED';
          const isRescheduled = invite.status === 'RESCHEDULED';
          const isPending = invite.status === 'PENDING' || isRescheduled;

          return (
            <div key={invite.id} className="my-3 max-w-sm mx-auto">
              <div
                className={`rounded-3xl border-2 p-4 shadow-lg bg-white dark:bg-slate-900 transition-all ${
                  isAccepted
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : isRejected
                    ? 'border-slate-300 dark:border-slate-700 opacity-70'
                    : 'border-rose-500 shadow-rose-500/10'
                }`}
              >
                {/* Header do Card de Convite */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1">
                    <UtensilsCrossed size={12} />
                    Convite de Encontro
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isAccepted
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : isRejected
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : isRescheduled
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                    }`}
                  >
                    {isAccepted
                      ? '✅ Encontro Confirmado!'
                      : isRejected
                      ? '❌ Recusado'
                      : isRescheduled
                      ? '🔄 Novo Horário Proposto'
                      : '⏳ Aguardando Resposta'}
                  </span>
                </div>

                {/* Foto e Restaurante */}
                <div className="flex items-center gap-3 my-3">
                  <img
                    src={invite.restauranteImagem}
                    alt={invite.restauranteNome}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {invite.restauranteNome}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={10} className="text-rose-500" />
                      {invite.endereco}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <Calendar size={11} /> {invite.dataEncontro}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <Clock size={11} /> {invite.horario}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mensagem anexada ao convite */}
                {invite.mensagem && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl italic">
                    "{invite.mensagem}"
                  </p>
                )}

                {/* Botões de Ação do Convite (Aceitar / Recusar / Propor outro horário/local) */}
                {isPending && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAcceptInvite(invite.id)}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-sm transition"
                      >
                        <Check size={14} /> Aceitar Encontro
                      </button>
                      <button
                        onClick={() => onUpdateInviteStatus(invite.id, 'REJECTED')}
                        className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition"
                      >
                        <X size={14} /> Recusar
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        onUpdateInviteStatus(invite.id, 'RESCHEDULED');
                        onOpenScheduleModal(activeMatch.partner);
                      }}
                      className="w-full py-2 px-3 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-rose-200/70 dark:border-rose-800/60 transition"
                    >
                      <RotateCcw size={13} /> Propor outro horário ou restaurante
                    </button>
                  </div>
                )}

                {/* Se Confirmado */}
                {isAccepted && (
                  <div className="mt-3 pt-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    🎉 Tudo pronto para o encontro! Nos vemos no restaurante!
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Quebra-gelos Rápidos */}
      <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto hide-scrollbar">
        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">Sugestões:</span>
        {[
          "Bora de Tonkotsu Lámen? 🍜",
          "Adoro a massa do Bella Napoli! 🍝",
          "Que tal um hambúrguer na brasa? 🍔",
          "Conhece algum café charmoso? ☕"
        ].map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => sendIcebreaker(phrase)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 whitespace-nowrap transition"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Conversar com ${activeMatch.partner?.nome.split(' ')[0]}...`}
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-xs focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center hover:opacity-95 shadow-md shadow-rose-500/20 transition shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
