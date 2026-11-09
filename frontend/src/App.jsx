import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SwipeCard from './components/SwipeCard';
import MatchModal from './components/MatchModal';
import RestaurantCatalog from './components/RestaurantCatalog';
import ChatView from './components/ChatView';
import ScheduleModal from './components/ScheduleModal';
import DatesView from './components/DatesView';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';

import {
  initialCategories,
  initialCurrentUser,
  initialFeedUsers,
  initialRestaurants,
  initialMatches,
  initialMessages,
  initialInvites
} from './mockData';

export default function App() {
  // Configurações visuais e temas
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('foodmatch_dark') === 'true';
  });
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Estado de Autenticação e Contas Salvas
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('foodmatch_authenticated') === 'true';
  });

  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('foodmatch_saved_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('foodmatch_current_user');
      return savedUser ? JSON.parse(savedUser) : initialCurrentUser;
    } catch {
      return initialCurrentUser;
    }
  });

  // Navegação
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'restaurants' | 'chat' | 'dates' | 'profile'

  // Estados principais da aplicação
  const [feedProfiles, setFeedProfiles] = useState(initialFeedUsers);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [categories, setCategories] = useState(initialCategories);
  const [matches, setMatches] = useState(initialMatches);
  const [selectedMatch, setSelectedMatch] = useState(initialMatches[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [invites, setInvites] = useState(initialInvites);

  // Modais
  const [matchedUserForModal, setMatchedUserForModal] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulePartner, setSchedulePartner] = useState(null);
  const [scheduleRestaurant, setScheduleRestaurant] = useState(null);

  // Tenta sincronizar com o backend Express se estiver rodando
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const resFeed = await fetch('/api/feed');
        if (resFeed.ok) {
          const data = await resFeed.json();
          if (data.data && data.data.length > 0) setFeedProfiles(data.data);
        }
        const resRest = await fetch('/api/restaurants');
        if (resRest.ok) {
          const data = await resRest.json();
          if (data.data && data.data.length > 0) setRestaurants(data.data);
        }
      } catch (err) {
        // Fallback gracioso para dados locais mockados
        console.log('Usando dados mockados locais do FoodMatch.');
      }
    };
    fetchBackendData();
  }, []);

  // Efeito de Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('foodmatch_dark', darkMode);
  }, [darkMode]);

  // Sempre que currentUser for atualizado (ex: trocou foto ou bio), sincroniza na lista de contas salvas
  const handleUpdateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('foodmatch_current_user', JSON.stringify(updatedUser));

    setSavedAccounts((prev) => {
      const exists = prev.some((acc) => acc.id === updatedUser.id);
      const next = exists
        ? prev.map((acc) => (acc.id === updatedUser.id ? updatedUser : acc))
        : [updatedUser, ...prev];
      localStorage.setItem('foodmatch_saved_accounts', JSON.stringify(next));
      return next;
    });
  };

  // Manipulador de Login ou Cadastro concluído
  const handleLoginSuccess = async (userObj, isNewRegistration = false) => {
    handleUpdateCurrentUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('foodmatch_authenticated', 'true');
    setActiveTab(isNewRegistration ? 'profile' : 'feed');

    try {
      const resFeed = await fetch(`/api/feed?currentUserId=${userObj.id}`);
      if (resFeed.ok) {
        const data = await resFeed.json();
        if (data.data && data.data.length > 0) setFeedProfiles(data.data);
      }
    } catch {
      // Fallback local
    }
  };

  // Manipulador de Logout (Voltar para a tela de Login / Cadastro)
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('foodmatch_authenticated', 'false');
  };

  // Calcula afinidade dinâmica com base nas preferências gastronômicas do usuário logado
  const computedFeedProfiles = feedProfiles
    .filter((u) => u.id !== currentUser?.id)
    .map((u) => {
      const userPrefs = currentUser?.preferencias || [1, 2];
      const targetPrefs = u.preferencias || [1, 2];
      const commonIds = targetPrefs.filter((id) => userPrefs.includes(id));
      const commonNames = commonIds
        .map((id) => categories.find((c) => c.id === id)?.nome)
        .filter(Boolean);

      const dynamicScore =
        commonIds.length >= 2
          ? Math.min(99, 88 + commonIds.length * 4)
          : commonIds.length === 1
          ? 85
          : u.compatibilidade || 82;

      return {
        ...u,
        compatibilidade: dynamicScore,
        culinariasEmComum:
          commonNames.length > 0
            ? commonNames
            : u.culinariasEmComum || ['Italiana', 'Doces & Cafés']
      };
    });

  // Manipulador de Swipe (Feed)
  const handleSwipe = (profile, action) => {
    if (action === 'LIKE' || action === 'SUPERLIKE') {
      const newMatch = {
        id: Date.now(),
        partner: profile,
        compatibilidade: profile.compatibilidade || 95,
        culinariasEmComum: profile.culinariasEmComum || ['Italiana', 'Japonesa'],
        matchDate: 'Agora há pouco',
        status: 'ACTIVE',
        ultimaMensagem: 'Vocês deram match! Que tal convidar para comer?'
      };

      setMatches((prev) => [newMatch, ...prev]);
      setSelectedMatch(newMatch);
      setMatchedUserForModal(profile);
    }
  };

  // Envio de Mensagem no Chat
  const handleSendMessage = (matchId, text) => {
    const now = new Date();
    const horario = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      matchId,
      senderId: 1, // Representa o usuário logado na conversa
      texto: text,
      horario,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Resposta automática simulada do Match após 1.5s
    setTimeout(() => {
      const responses = [
        "Nossa, adorei a ideia! Estava mesmo querendo conhecer um lugar novo!",
        "Esse restaurante é fantástico, o cardápio é impecável! 😍",
        "Com certeza! Bora marcar sim, que dia fica bom pra você?",
        "Que delícia! Eu adoro essa culinária, você tem ótimo bom gosto!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          matchId,
          senderId: selectedMatch?.partner?.id || 2,
          texto: randomResponse,
          horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  // Abertura do Modal de Agendamento vindo de um Restaurante ou Chat
  const handleOpenSchedule = (partner, preselectedRestaurant = null) => {
    setSchedulePartner(partner || selectedMatch?.partner || matches[0]?.partner);
    setScheduleRestaurant(preselectedRestaurant || restaurants[0]);
    setScheduleModalOpen(true);
  };

  // Envio do Convite de Encontro
  const handleSendInvite = (inviteData) => {
    const targetMatch = selectedMatch || matches[0];
    const newInvite = {
      id: Date.now(),
      matchId: targetMatch.id,
      inviterId: 1,
      inviteeId: targetMatch.partner.id,
      ...inviteData,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setInvites((prev) => [...prev, newInvite]);

    // Adiciona uma mensagem de sistema no chat
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        matchId: targetMatch.id,
        senderId: 1,
        texto: `🍽️ Enviei um convite para o ${inviteData.restauranteNome} no dia ${inviteData.dataEncontro} às ${inviteData.horario}!`,
        horario: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Navega para a aba de chat para ver o convite enviado
    setActiveTab('chat');
  };

  // Atualização do Status do Convite (Aceitar / Recusar / Reagendar)
  const handleUpdateInviteStatus = (inviteId, newStatus) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === inviteId ? { ...inv, status: newStatus } : inv))
    );

    const invite = invites.find((i) => i.id === inviteId);
    if (invite && newStatus === 'ACCEPTED') {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          matchId: invite.matchId,
          senderId: invite.inviteeId,
          texto: `🎉 Convite Aceito! Confirmadíssimo no ${invite.restauranteNome}! Mal posso esperar pelo nosso date gastronômico!`,
          horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Conteúdo Central por Aba (ou Tela de Login/Cadastro se não autenticado)
  const renderTabContent = () => {
    if (!isAuthenticated) {
      return (
        <AuthView
          categories={categories}
          onLoginSuccess={handleLoginSuccess}
          savedAccounts={savedAccounts}
        />
      );
    }

    switch (activeTab) {
      case 'feed':
        return (
          <SwipeCard
            profiles={computedFeedProfiles}
            onSwipe={handleSwipe}
            onReset={() => setFeedProfiles([...initialFeedUsers])}
            onDirectInvite={(user) => handleOpenSchedule(user)}
          />
        );
      case 'restaurants':
        return (
          <RestaurantCatalog
            restaurants={restaurants}
            categories={categories}
            onSelectRestaurantToDate={(res) => {
              handleOpenSchedule(selectedMatch?.partner, res);
            }}
          />
        );
      case 'chat':
        return (
          <ChatView
            matches={matches}
            selectedMatch={selectedMatch}
            setSelectedMatch={setSelectedMatch}
            messages={messages.filter((m) => m.matchId === selectedMatch?.id)}
            onSendMessage={handleSendMessage}
            onOpenScheduleModal={(partner) => handleOpenSchedule(partner)}
            onUpdateInviteStatus={handleUpdateInviteStatus}
            invites={invites}
          />
        );
      case 'dates':
        return (
          <DatesView
            invites={invites}
            matches={matches}
            onOpenChatWithPartner={(matchId) => {
              const target = matches.find((m) => m.id === matchId);
              if (target) setSelectedMatch(target);
              setActiveTab('chat');
            }}
          />
        );
      case 'profile':
        return (
          <ProfileView
            currentUser={currentUser}
            setCurrentUser={handleUpdateCurrentUser}
            categories={categories}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-[#FDF8F4] dark:bg-slate-950 transition-colors`}>
      {/* Moldura de Smartphone Opcional para Demonstração Mobile-First */}
      <div className={isPhoneFrame ? 'py-8 px-4 flex justify-center items-center min-h-screen bg-slate-200 dark:bg-slate-900' : ''}>
        <div
          className={
            isPhoneFrame
              ? 'w-full max-w-sm bg-[#FDF8F4] dark:bg-slate-900 rounded-[42px] border-[10px] border-slate-900 shadow-2xl overflow-hidden min-h-[820px] relative flex flex-col'
              : 'min-h-screen flex flex-col'
          }
        >
          {/* Header Superior (exibido quando logado ou no modo frame; na landing page a AuthView já tem sua navbar dedicada) */}
          {isAuthenticated && (
            <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              isPhoneFrame={isPhoneFrame}
              setIsPhoneFrame={setIsPhoneFrame}
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
              onOpenProfile={() => {
                if (isAuthenticated) setActiveTab('profile');
              }}
              onLogout={handleLogout}
            />
          )}

          {/* Área de Conteúdo Principal */}
          <main className={`flex-1 px-4 py-4 mx-auto w-full ${isAuthenticated ? 'max-w-4xl' : 'max-w-6xl'}`}>
            {renderTabContent()}
          </main>

          {/* Navegação Inferior (Mobile-first) - exibida quando logado */}
          {isAuthenticated && (
            <BottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              unreadMessages={1}
              pendingDates={invites.filter((i) => i.status === 'PENDING').length}
            />
          )}

          {/* Modal de Match */}
          {matchedUserForModal && (
            <MatchModal
              matchUser={matchedUserForModal}
              currentUser={currentUser}
              onClose={() => setMatchedUserForModal(null)}
              onOpenChat={() => {
                setActiveTab('chat');
              }}
              onOpenSchedule={(user) => {
                handleOpenSchedule(user);
              }}
            />
          )}

          {/* Modal de Agendamento do Encontro */}
          <ScheduleModal
            isOpen={scheduleModalOpen}
            onClose={() => setScheduleModalOpen(false)}
            partner={schedulePartner}
            restaurant={scheduleRestaurant}
            restaurantsList={restaurants}
            onSendInvite={handleSendInvite}
          />
        </div>
      </div>
    </div>
  );
}
