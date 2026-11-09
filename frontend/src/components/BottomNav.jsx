import React from 'react';
import { Flame, UtensilsCrossed, MessageCircle, CalendarHeart, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, unreadMessages = 1, pendingDates = 1 }) {
  const tabs = [
    { id: 'feed', label: 'Descobrir', icon: Flame, badge: null },
    { id: 'restaurants', label: 'Restaurantes', icon: UtensilsCrossed, badge: null },
    { id: 'chat', label: 'Matches', icon: MessageCircle, badge: unreadMessages },
    { id: 'dates', label: 'Encontros', icon: CalendarHeart, badge: pendingDates },
    { id: 'profile', label: 'Perfil', icon: User, badge: null },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                isActive
                  ? 'text-rose-600 dark:text-rose-500 scale-105'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-semibold mt-1 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-rose-600 dark:bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
