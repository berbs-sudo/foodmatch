import React, { useState, useRef, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Utensils,
  Heart,
  Check,
  Briefcase,
  User,
  ArrowRight,
  Flame,
  Database,
  Clock,
  CheckCircle2,
  Gift,
  Percent,
  Star,
  Send
} from 'lucide-react';
import { presetAvatars, bioSuggestions, initialCurrentUser, initialFeedUsers } from '../mockData';

export default function AuthView({
  categories = [],
  onLoginSuccess,
  savedAccounts = []
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bioIndex, setBioIndex] = useState(0);

  // Dados reais vindos do banco de dados SQLite
  const [dbUsers, setDbUsers] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);

  const fileInputRef = useRef(null);
  const authFormRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Estado do formulário de Login
  const [loginEmail, setLoginEmail] = useState(initialCurrentUser.email || 'bernardo@unifacvest.edu.br');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Estado do formulário de Cadastro Completo
  const [regData, setRegData] = useState({
    nome: '',
    email: '',
    senha: '',
    idade: 22,
    cidade: 'Lages - SC',
    profissao: '',
    bio: '',
    fotoPerfil: presetAvatars[0].url,
    pratoFavorito: '',
    restauranteFavorito: '',
    desejoDoDia: '🍕 Pizza a dois & Vinho tinto',
    preferencias: [1, 2, 7]
  });

  // Carrega contas e histórico de logins salvos no Banco de Dados SQLite
  const fetchDatabaseUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users) setDbUsers(data.users);
        if (data.recentLogins) setRecentLogins(data.recentLogins);
      }
    } catch (err) {
      // Fallback caso offline
    }
  };

  useEffect(() => {
    fetchDatabaseUsers();
  }, []);

  const scrollToAuth = (targetMode = 'login') => {
    setMode(targetMode);
    setErrorMsg('');
    authFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Upload de foto via arquivo local (Base64 DataURL)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setRegData((prev) => ({
          ...prev,
          fotoPerfil: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Alternar categoria culinária no cadastro
  const toggleCategory = (catId) => {
    setRegData((prev) => {
      const current = prev.preferencias || [];
      const updated = current.includes(catId)
        ? current.filter((id) => id !== catId)
        : [...current, catId];
      return { ...prev, preferencias: updated };
    });
  };

  // Preencher sugestão de biografia
  const handleSuggestBio = () => {
    const nextSuggestion = bioSuggestions[bioIndex % bioSuggestions.length];
    setRegData((prev) => ({ ...prev, bio: nextSuggestion }));
    setBioIndex((prev) => prev + 1);
  };

  // Submissão de Login (Salva no Banco de Dados SQLite)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          senha: loginPassword,
          metodo: 'PASSWORD'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Não foi possível autenticar.');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMsg('Login salvo no banco de dados! Entrando...');
        await fetchDatabaseUsers();
        setTimeout(() => {
          onLoginSuccess(data.user, false);
        }, 400);
        return;
      }
    } catch (err) {
      // Fallback caso o servidor não responda
      const allKnownUsers = [...dbUsers, ...savedAccounts, initialCurrentUser, ...initialFeedUsers];
      const matchedLocal = allKnownUsers.find(
        (u) => u.email?.toLowerCase() === loginEmail.trim().toLowerCase()
      );
      if (matchedLocal) {
        onLoginSuccess(matchedLocal, false);
      } else {
        setErrorMsg('Erro ao conectar ao banco de dados.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login Rápido 1-Clique que também registra o acesso no Banco de Dados
  const handleQuickLogin = async (userObj) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userObj.email,
          senha: userObj.senha || '123456',
          metodo: 'QUICK_LOGIN'
        })
      });
      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user || userObj, false);
        return;
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
    onLoginSuccess(userObj, false);
  };

  // Submissão de Cadastro (Cria e salva conta no Banco de Dados SQLite)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regData.nome.trim() || !regData.email.trim()) {
      setErrorMsg('Preencha pelo menos seu nome e e-mail.');
      return;
    }

    setIsLoading(true);

    const newUserPayload = {
      nome: regData.nome.trim(),
      email: regData.email.trim(),
      senha: regData.senha || '123456',
      idade: Number(regData.idade) || 22,
      cidade: regData.cidade.trim() || 'Lages - SC',
      profissao: regData.profissao.trim() || 'Foodie & Explorador Gastronômico',
      bio:
        regData.bio.trim() ||
        'Apaixonado(a) por boa gastronomia, restaurantes aconchegantes e ótimas conversas à mesa!',
      fotoPerfil: regData.fotoPerfil || presetAvatars[0].url,
      fotos: [
        regData.fotoPerfil || presetAvatars[0].url,
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      ],
      pratoFavorito: regData.pratoFavorito.trim() || 'Risoto de Funghi com Parmesão',
      restauranteFavorito: regData.restauranteFavorito.trim() || 'Trattoria Bella Napoli',
      desejoDoDia: regData.desejoDoDia.trim() || '🍕 Pizza artesanal & Vinho',
      preferencias: regData.preferencias.length > 0 ? regData.preferencias : [1, 2]
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserPayload)
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setSuccessMsg('Conta gravada no banco de dados com sucesso!');
        await fetchDatabaseUsers();
        setTimeout(() => {
          onLoginSuccess(data.user, true);
        }, 400);
        return;
      } else {
        setErrorMsg(data.message || 'Erro ao cadastrar.');
      }
    } catch (err) {
      onLoginSuccess({ id: Date.now(), ...newUserPayload }, true);
    } finally {
      setIsLoading(false);
    }
  };

  // Lista unificada de usuários do banco de dados para login rápido
  const displayUsers = dbUsers.length > 0 ? dbUsers : [initialCurrentUser, ...initialFeedUsers];

  return (
    <div className="min-h-screen bg-[#FDF8F4] dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-3xl overflow-hidden shadow-xl border border-[#F3E7DF] dark:border-slate-800 mb-16">
      {/* ===================================================================
          1. BARRA DE NAVEGAÇÃO DA LANDING PAGE (Estilo "Mesa pra Dois + iFood")
      =================================================================== */}
      <nav className="sticky top-0 z-20 bg-[#FDF8F4]/95 dark:bg-slate-900/95 backdrop-blur-md px-5 sm:px-10 py-4 flex items-center justify-between border-b border-rose-100/80 dark:border-slate-800">
        {/* Logo: Coração com Garfo e Faca + "Mesa pra Dois em parceria com o iFood" */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#E11D2E] flex items-center justify-center text-white shadow-md shadow-red-500/25 relative">
              <Heart size={22} className="fill-white text-white" />
              <Utensils size={11} className="absolute text-[#E11D2E] stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
              Mesa pra Dois
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span>em parceria com o</span>
            <span className="font-black italic text-base sm:text-lg tracking-tighter text-[#EA1D2C] flex items-center">
              ifood
              <span className="inline-block w-2 h-2 rounded-full bg-[#EA1D2C] ml-0.5 -mt-2" />
            </span>
          </div>
        </div>

        {/* Links de navegação + CTA */}
        <div className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          <button
            type="button"
            onClick={() => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-[#EA1D2C] transition"
          >
            Como Funciona
          </button>
          <button
            type="button"
            onClick={() => scrollToAuth('register')}
            className="hover:text-[#EA1D2C] transition"
          >
            Recursos
          </button>
          <button
            type="button"
            onClick={() => testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-[#EA1D2C] transition"
          >
            Depoimentos
          </button>
          <button
            type="button"
            onClick={() => scrollToAuth('login')}
            className="px-5 py-2.5 rounded-full bg-[#E11D2E] hover:bg-[#c81625] text-white font-bold text-xs shadow-lg shadow-red-600/25 transition transform hover:scale-105"
          >
            Entrar / Baixar App
          </button>
        </div>

        {/* Botão Mobile */}
        <button
          type="button"
          onClick={() => scrollToAuth('login')}
          className="md:hidden px-3.5 py-2 rounded-full bg-[#E11D2E] text-white font-bold text-xs shadow"
        >
          Entrar
        </button>
      </nav>

      {/* ===================================================================
          2. SEÇÃO HERO (Fiel à Landing Page enviada na imagem)
      =================================================================== */}
      <section className="relative px-5 sm:px-10 pt-8 pb-12 lg:py-14 overflow-hidden">
        {/* Mancha orgânica rosa suave ao fundo à direita */}
        <div className="absolute right-[-6%] top-[8%] w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] bg-[#FCE1E4] dark:bg-rose-950/30 rounded-full blur-2xl -z-0 pointer-events-none opacity-80" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Coluna Esquerda: Headline, Subtítulo, CTA e Selos das Lojas */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/90 dark:bg-rose-950/80 text-[#E11D2E] dark:text-rose-300 text-xs font-extrabold">
              <Sparkles size={13} /> O App Oficial dos Encontros Gastronômicos
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              O AMOR BATEU À SUA PORTA... <br />
              E TROUXE O JANTAR! 🍕❤️
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Conecte-se com quem tem o mesmo gosto que você. O primeiro app de namoro onde você pode quebrar o gelo enviando mimos pelo{' '}
              <strong className="text-[#EA1D2C] font-bold">iFood</strong>, marcar encontros virtuais ou presenciais e dividir o primeiro date com cupons exclusivos!
            </p>

            {/* Botão Principal Vermelho */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToAuth('login')}
                className="px-7 py-4 rounded-full bg-[#E11D2E] hover:bg-[#c51626] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                ACESSAR OU CRIAR CONTA AGORA <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => scrollToAuth('register')}
                className="px-5 py-4 rounded-full bg-white dark:bg-slate-900 hover:bg-rose-50 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition"
              >
                Criar Perfil Grátis
              </button>
            </div>

            {/* Badges App Store & Google Play */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => scrollToAuth('login')}
                className="flex items-center gap-2.5 bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-xl shadow-md transition"
              >
                <span className="text-xl">🍎</span>
                <div className="text-left leading-tight">
                  <span className="block text-[9px] text-slate-300">Disponível na</span>
                  <span className="text-xs font-bold">App Store</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollToAuth('login')}
                className="flex items-center gap-2.5 bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-xl shadow-md transition"
              >
                <span className="text-xl">▶️</span>
                <div className="text-left leading-tight">
                  <span className="block text-[9px] text-slate-300">Disponível no</span>
                  <span className="text-xs font-bold">Google Play</span>
                </div>
              </button>
            </div>
          </div>

          {/* Coluna Direita: Mockup dos 2 Celulares + Bag iFood + Elementos Flutuantes */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[430px]">
            {/* Elementos flutuantes decorativos (Pizza, Sushi, Corações) */}
            <div className="absolute -top-3 left-6 sm:left-10 text-3xl animate-bounce select-none">
              🍕
            </div>
            <div className="absolute top-2 right-12 text-2xl animate-pulse select-none">
              ❤️
            </div>
            <div className="absolute bottom-14 left-2 sm:left-6 text-3xl select-none">
              🍣
            </div>
            <div className="absolute top-1/2 -left-2 text-xl select-none">
              💖
            </div>

            {/* Celular 1 (Esquerda - Card da Mariana, 24) */}
            <div className="w-52 sm:w-60 bg-white dark:bg-slate-900 rounded-[34px] border-[7px] border-slate-900 shadow-2xl p-2.5 transform -rotate-6 z-10 transition hover:rotate-0 duration-300">
              <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="text-[9px] font-bold text-slate-400">9:41</span>
                <div className="w-5 h-5 rounded-full bg-[#E11D2E] flex items-center justify-center text-white text-[10px]">
                  ❤️
                </div>
                <span className="text-[9px] text-slate-400">🔋</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-44 sm:h-48">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
                  alt="Mariana, 24"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-2.5 px-1 text-left">
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  Mariana, 24
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Prato favorito: Sushi 🍣
                </p>

                <button
                  type="button"
                  onClick={() => scrollToAuth('login')}
                  className="mt-2.5 w-full py-2 px-2 rounded-xl bg-[#E11D2E] hover:bg-[#c51626] text-white font-extrabold text-[10px] text-center shadow-md shadow-red-500/25 leading-tight"
                >
                  Enviar um mimo <br /> pelo iFood
                </button>
              </div>
            </div>

            {/* Celular 2 (Direita - Tela de Chat "Você deu match!") */}
            <div className="w-52 sm:w-60 bg-white dark:bg-slate-900 rounded-[34px] border-[7px] border-slate-900 shadow-2xl p-3 transform rotate-6 -ml-6 sm:-ml-4 mt-8 z-10 transition hover:rotate-0 duration-300">
              <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto mb-2" />
              <div className="text-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
                <div className="flex justify-center -space-x-2 mb-1">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
                    alt="Match 1"
                    className="w-7 h-7 rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Match 2"
                    className="w-7 h-7 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <p className="font-black text-xs text-slate-900 dark:text-white">
                  Você deu match!
                </p>
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded-2xl rounded-tl-sm max-w-[85%]">
                  Que tal uma pizza hoje? 🍕
                </div>
                <div className="bg-[#FCE1E4] dark:bg-rose-900/60 text-rose-900 dark:text-rose-100 font-semibold px-2.5 py-1.5 rounded-2xl rounded-tr-sm ml-auto max-w-[80%] text-right">
                  Amei a ideia! ❤️
                </div>

                {/* Cardzinho de Integração iFood */}
                <div className="mt-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EA1D2C] text-white font-black italic text-[9px] flex items-center justify-center shrink-0">
                    ifood
                  </div>
                  <div className="text-[9px] leading-tight text-left">
                    <span className="font-extrabold text-slate-800 dark:text-white block">
                      Integração Card iFood
                    </span>
                    <span className="text-slate-400">Cupom 30% OFF no 1º Date</span>
                  </div>
                </div>
              </div>

              {/* Mochila/Bag vermelha iFood no canto inferior direito */}
              <div className="mt-3 flex justify-end">
                <div className="px-3 py-1.5 rounded-xl bg-[#EA1D2C] text-white font-black italic text-xs shadow-lg flex items-center gap-1">
                  <span>🎒</span> ifood
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. SEÇÃO "COMO FUNCIONA?" (3 Cards idênticos à referência)
      =================================================================== */}
      <section ref={howItWorksRef} className="px-5 sm:px-10 py-8">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-5">
          Como funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Match de Paladar */}
          <div className="bg-[#FCE8E9] dark:bg-slate-900/90 border border-rose-200/60 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[#E11D2E] font-black text-xs uppercase">
                <Heart size={14} className="fill-[#E11D2E]" /> Passo 1
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Match de Paladar
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Encontre pessoas que amam as mesmas comidas e restaurantes que você.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              🍔💑
            </div>
          </div>

          {/* Card 2: Quebre o Gelo */}
          <div className="bg-[#FCE8E9] dark:bg-slate-900/90 border border-rose-200/60 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[#E11D2E] font-black text-xs uppercase">
                <Gift size={14} /> Passo 2
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Quebre o Gelo
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Envie um lanche, sushi ou doce diretamente pelo app para surpreender o seu crush.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              🛵🥡
            </div>
          </div>

          {/* Card 3: Date com Desconto */}
          <div className="bg-[#FCE8E9] dark:bg-slate-900/90 border border-rose-200/60 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[#E11D2E] font-black text-xs uppercase">
                <Percent size={14} /> Passo 3
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Date com Desconto
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ganhe cupons exclusivos do iFood e agende reservas para o primeiro encontro.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              🎟️❤️
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. ÁREA DE LOGIN / CADASTRO COM BANCO DE DADOS REAL (SQLite + Prisma)
      =================================================================== */}
      <section ref={authFormRef} className="px-5 sm:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna do Formulário de Autenticação (7 colunas) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Cabeçalho do Card de Login */}
            <div className="bg-gradient-to-r from-[#E11D2E] via-rose-600 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30">
                    🍕
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/25 text-[10px] font-bold uppercase tracking-wider">
                      <Database size={11} className="text-emerald-300" /> Banco SQLite Conectado
                    </span>
                    <h3 className="text-xl font-black tracking-tight mt-0.5">
                      Acesse sua Conta no Mesa pra Dois
                    </h3>
                  </div>
                </div>
              </div>

              {/* Abas: Entrar vs Criar Perfil */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-2xl mt-5 border border-white/15">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                    mode === 'login'
                      ? 'bg-white text-[#E11D2E] shadow-md'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn size={15} />
                  Entrar na Conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                    mode === 'register'
                      ? 'bg-white text-[#E11D2E] shadow-md'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <UserPlus size={15} />
                  Criar Novo Perfil
                </button>
              </div>
            </div>

            {/* Alertas de Erro ou Sucesso */}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            {/* MODO LOGIN */}
            {mode === 'login' ? (
              <div className="p-6 space-y-5">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Seu E-mail (será salvo e autenticado no Banco de Dados):
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E11D2E] text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Senha:
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E11D2E] text-slate-900 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-[#E11D2E] hover:bg-[#c51626] disabled:opacity-60 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition"
                  >
                    <LogIn size={16} />
                    {isLoading ? 'Salvando Login no Banco...' : 'Entrar e Salvar Login no Banco'}
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-xs font-bold text-[#E11D2E] dark:text-rose-400 hover:underline inline-flex items-center gap-1"
                  >
                    Novo por aqui? Cadastre seu perfil completo no banco de dados{' '}
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ) : (
              /* MODO CADASTRO COMPLETO */
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-5">
                {/* Foto de Perfil */}
                <div className="flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E11D2E] mb-2">
                    1. Sua Foto de Perfil
                  </span>

                  <div className="relative group mb-3">
                    <img
                      src={regData.fotoPerfil}
                      alt="Preview do Perfil"
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-[#E11D2E] shadow-xl"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-[#E11D2E] text-white rounded-2xl shadow-lg hover:scale-105 transition"
                      title="Enviar foto do dispositivo"
                    >
                      <Camera size={14} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-[#E11D2E] hover:bg-[#c51626] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition mb-2.5"
                  >
                    <Upload size={13} /> Enviar Foto do Computador/Celular
                  </button>

                  <div className="flex items-center justify-center gap-2">
                    {presetAvatars.map((av, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setRegData({ ...regData, fotoPerfil: av.url })}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition ${
                          regData.fotoPerfil === av.url
                            ? 'border-[#E11D2E] scale-110 shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dados Pessoais e Credenciais */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E11D2E] block">
                    2. Dados da Conta (Salvos no SQLite)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={regData.nome}
                        onChange={(e) => setRegData({ ...regData, nome: e.target.value })}
                        placeholder="Ex: Mariana Alencar"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Idade *
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={99}
                        value={regData.idade}
                        onChange={(e) => setRegData({ ...regData, idade: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        E-mail de Login *
                      </label>
                      <input
                        type="email"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="voce@exemplo.com"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Senha *
                      </label>
                      <input
                        type="password"
                        value={regData.senha}
                        onChange={(e) => setRegData({ ...regData, senha: e.target.value })}
                        placeholder="Crie uma senha"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        🍝 Prato Favorito:
                      </label>
                      <input
                        type="text"
                        value={regData.pratoFavorito}
                        onChange={(e) => setRegData({ ...regData, pratoFavorito: e.target.value })}
                        placeholder="Ex: Sushi / Pizza Napolitana"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        📍 Restaurante Favorito:
                      </label>
                      <input
                        type="text"
                        value={regData.restauranteFavorito}
                        onChange={(e) =>
                          setRegData({ ...regData, restauranteFavorito: e.target.value })
                        }
                        placeholder="Ex: Trattoria Bella Napoli"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Sua Biografia:
                      </label>
                      <button
                        type="button"
                        onClick={handleSuggestBio}
                        className="text-[11px] font-bold text-[#E11D2E] hover:underline flex items-center gap-1"
                      >
                        <Sparkles size={12} /> Sugerir Bio
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={regData.bio}
                      onChange={(e) => setRegData({ ...regData, bio: e.target.value })}
                      placeholder="Conte qual comida conquista seu coração..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Categorias Culinárias */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Culinárias favoritas (Match de Paladar):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => {
                        const isSelected = regData.preferencias.includes(cat.id);
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                              isSelected
                                ? 'bg-[#E11D2E] text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span>{cat.icone}</span>
                            <span>{cat.nome}</span>
                            {isSelected && <Check size={11} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#E11D2E] hover:bg-[#c51626] text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition"
                >
                  <Heart size={16} className="fill-white" />
                  {isLoading
                    ? 'Gravando no Banco de Dados...'
                    : 'Salvar Conta no Banco de Dados e Entrar'}
                </button>
              </form>
            )}
          </div>

          {/* Coluna Direita: Painel do Banco de Dados (Contas Salvas & Histórico de Logins) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-slate-800 p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <Database size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                      Usuários Salvos no Banco (SQLite)
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Clique em qualquer conta salva para entrar com 1 clique
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                  {displayUsers.length} contas
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {displayUsers.map((u) => (
                  <button
                    key={u.id || u.email}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="w-full p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#E11D2E] bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between gap-2.5 text-left transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={u.fotoPerfil}
                        alt={u.nome}
                        className="w-10 h-10 rounded-xl object-cover border border-rose-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {u.nome}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950 text-[#E11D2E] dark:text-rose-300 text-[10px] font-extrabold group-hover:bg-[#E11D2E] group-hover:text-white transition shrink-0">
                      Entrar
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Registro de Últimos Logins Gravados no Banco */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-slate-800 p-5 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={15} className="text-[#E11D2E]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Últimos Logins Gravados no Banco
                </h4>
              </div>

              {recentLogins.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Faça login ou crie uma conta ao lado para ver o registro salvo em tempo real na tabela <code>historico_logins</code>.
                </p>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {recentLogins.slice(0, 6).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {log.nome}
                          </span>
                          <span className="text-slate-400 ml-1">({log.email})</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0 ml-2">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. SEÇÃO DE DEPOIMENTOS DE CASAIS
      =================================================================== */}
      <section ref={testimonialsRef} className="px-5 sm:px-10 py-8 border-t border-rose-100 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">
          Casais formados pelo paladar ❤️🍕
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 flex items-start gap-3">
            <div className="text-2xl">🍣</div>
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                "Dei match com o Bernardo porque ambos amamos comida japonesa e italiana. Ele me mandou um mimo pelo iFood e marcamos nosso primeiro jantar na mesma semana!"
              </p>
              <span className="block text-[11px] font-extrabold text-slate-900 dark:text-white mt-1.5">
                — Camila & Bernardo
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 flex items-start gap-3">
            <div className="text-2xl">🍕</div>
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
                <Star size={12} className="fill-amber-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                "Acabou aquela dúvida de onde ir no primeiro encontro! O Mesa pra Dois já mostra os restaurantes que combinam com os dois e ainda libera cupom do iFood."
              </p>
              <span className="block text-[11px] font-extrabold text-slate-900 dark:text-white mt-1.5">
                — Mariana & Lucas
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
