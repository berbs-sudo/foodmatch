import React from 'react';
import { Moon, Sun, Smartphone, Monitor, LogOut, LogIn, Heart, Utensils } from 'lucide-react';

export default function Header({
  darkMode,
  setDarkMode,
  isPhoneFrame,
  setIsPhoneFrame,
  currentUser,
  isAuthenticated,
  onOpenProfile,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#FDF8F4]/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Mesa pra Dois em parceria com o iFood */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#E11D2E] flex items-center justify-center shadow-lg shadow-red-500/25 text-white relative">
            <Heart size={22} className="fill-white text-white" />
            <Utensils size={11} className="absolute text-[#E11D2E] stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                Mesa pra Dois
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">
                em parceria com o
              </span>
              <span className="font-black italic text-sm sm:text-base tracking-tighter text-[#EA1D2C]">
                ifood
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
              O amor bateu à sua porta e trouxe o jantar 🍕❤️
            </p>
          </div>
        </div>

        {/* Action Controls & User Chip */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Chip do Usuário Logado + Botão de Trocar Conta / Login */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenProfile}
                title="Ir para Meu Perfil (Editar Foto e Bio)"
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              >
                <img
                  src={currentUser.fotoPerfil}
                  alt={currentUser.nome}
                  className="w-6 h-6 rounded-full object-cover border border-rose-400"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline max-w-[90px] truncate">
                  {currentUser.nome.split(' ')[0]}
                </span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                title="Sair / Trocar Conta (Tela de Login)"
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              <LogIn size={12} /> Login / Cadastro
            </span>
          )}

          {/* Frame Mode Toggle (para demonstrar responsividade mobile-first) */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            title={isPhoneFrame ? "Modo Tela Cheia" : "Modo Moldura Mobile"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isPhoneFrame ? <Monitor size={18} /> : <Smartphone size={18} />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
