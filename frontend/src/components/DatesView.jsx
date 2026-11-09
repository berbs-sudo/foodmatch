import React from 'react';
import { CalendarHeart, MapPin, Clock, Calendar, CheckCircle, AlertCircle, UtensilsCrossed, ExternalLink } from 'lucide-react';

export default function DatesView({ invites = [], onOpenChatWithPartner, matches = [] }) {
  const confirmedDates = invites.filter((i) => i.status === 'ACCEPTED');
  const pendingDates = invites.filter((i) => i.status === 'PENDING');

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 rounded-3xl p-5 text-white shadow-lg shadow-rose-500/20">
        <div className="flex items-center gap-2 mb-1">
          <CalendarHeart size={20} />
          <span className="text-xs font-black uppercase tracking-wider">Sua Agenda de Encontros</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">Datas & Restaurantes Marcados</h2>
        <p className="text-xs text-rose-100 max-w-md">
          Acompanhe todos os seus encontros gastronômicos combinados com seus matches pelo FoodMatch.
        </p>
      </div>

      {/* Encontros Confirmados */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <CheckCircle size={14} className="text-emerald-500" />
          Confirmados ({confirmedDates.length})
        </h3>

        {confirmedDates.length === 0 ? (
          <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-3xl mb-2">🥂</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Nenhum encontro confirmado ainda
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Aceite um convite no chat ou convide um match para comer!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {confirmedDates.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/80 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.restauranteImagem}
                    alt={item.restauranteNome}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <span className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
                      CONFIRMADO 🎉
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {item.restauranteNome}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-rose-500" /> {item.endereco}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {item.dataEncontro}
                      </span>
                      <span className="flex items-center gap-1 text-orange-500">
                        <Clock size={12} /> {item.horario}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <button
                    onClick={() => onOpenChatWithPartner(item.matchId)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 transition"
                  >
                    Ver Conversa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Convites Pendentes */}
      {pendingDates.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <AlertCircle size={14} className="text-amber-500" />
            Aguardando Confirmação ({pendingDates.length})
          </h3>

          <div className="space-y-2">
            {pendingDates.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.restauranteImagem}
                    alt={item.restauranteNome}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white">
                      {item.restauranteNome}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.dataEncontro} às {item.horario}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenChatWithPartner(item.matchId)}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold"
                >
                  Responder no Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
