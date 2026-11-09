import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Edit3,
  Camera,
  MapPin,
  Utensils,
  Heart,
  Check,
  Save,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  LogOut,
  Mail,
  Briefcase,
  Flame,
  Image as ImageIcon
} from 'lucide-react';
import { presetAvatars, bioSuggestions } from '../mockData';

export default function ProfileView({
  currentUser,
  setCurrentUser,
  categories = [],
  onLogout
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [bioSuggestIdx, setBioSuggestIdx] = useState(0);

  const avatarFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Sincroniza formData caso currentUser mude externamente (ex: login em outra conta)
  useEffect(() => {
    setFormData({ ...currentUser });
  }, [currentUser]);

  const persistUserUpdate = async (updatedUser) => {
    setCurrentUser(updatedUser);
    setFormData(updatedUser);
    localStorage.setItem('foodmatch_current_user', JSON.stringify(updatedUser));

    try {
      await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch (err) {
      // Fallback local já salvo no localStorage
    }

    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2800);
  };

  // Upload direto para a foto principal de perfil
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const currentPhotos = formData.fotos || [formData.fotoPerfil];
        const updatedPhotos = [reader.result, ...currentPhotos.filter((p) => p !== reader.result)];
        const updated = {
          ...formData,
          fotoPerfil: reader.result,
          fotos: updatedPhotos
        };
        if (isEditing) {
          setFormData(updated);
        } else {
          persistUserUpdate(updated);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload de foto extra para a galeria do perfil
  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const currentPhotos = formData.fotos || [formData.fotoPerfil];
        const updated = {
          ...formData,
          fotos: [...currentPhotos, reader.result]
        };
        persistUserUpdate(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryUrl = (e) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const currentPhotos = formData.fotos || [formData.fotoPerfil];
    const updated = {
      ...formData,
      fotos: [...currentPhotos, newPhotoUrl.trim()]
    };
    setNewPhotoUrl('');
    persistUserUpdate(updated);
  };

  const handleRemoveGalleryPhoto = (photoToRemove) => {
    const currentPhotos = formData.fotos || [formData.fotoPerfil];
    if (currentPhotos.length <= 1) return; // Mantém ao menos 1 foto
    const filtered = currentPhotos.filter((p) => p !== photoToRemove);
    const updated = {
      ...formData,
      fotos: filtered,
      fotoPerfil: formData.fotoPerfil === photoToRemove ? filtered[0] : formData.fotoPerfil
    };
    persistUserUpdate(updated);
  };

  const handleSetMainPhoto = (photoUrl) => {
    const updated = {
      ...formData,
      fotoPerfil: photoUrl
    };
    persistUserUpdate(updated);
  };

  const toggleCategory = (catId) => {
    const current = formData.preferencias || [];
    const updated = current.includes(catId)
      ? current.filter((id) => id !== catId)
      : [...current, catId];
    setFormData({ ...formData, preferencias: updated });
  };

  const handleSuggestBio = () => {
    const suggestion = bioSuggestions[bioSuggestIdx % bioSuggestions.length];
    setFormData({ ...formData, bio: suggestion });
    setBioSuggestIdx((prev) => prev + 1);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const currentPhotos = formData.fotos || [];
    const updatedPhotos = currentPhotos.includes(formData.fotoPerfil)
      ? currentPhotos
      : [formData.fotoPerfil, ...currentPhotos];

    const finalUser = {
      ...formData,
      fotos: updatedPhotos.length > 0 ? updatedPhotos : [formData.fotoPerfil]
    };

    persistUserUpdate(finalUser);
    setIsEditing(false);
  };

  const userGallery = currentUser.fotos?.length > 0
    ? currentUser.fotos
    : [currentUser.fotoPerfil];

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-24">
      {/* Input oculto para trocar foto de perfil diretamente clicando na câmera */}
      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
      <input
        ref={galleryFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryUpload}
        className="hidden"
      />

      {/* Feedback de salvamento */}
      {saveFeedback && (
        <div className="p-3 bg-emerald-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg animate-bounce">
          <Check size={16} /> Perfil, foto e preferências gastronômicas salvos com sucesso!
        </div>
      )}

      {/* Card Principal do Perfil */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar com botão direto de Upload de Foto */}
          <div className="relative group">
            <img
              src={currentUser.fotoPerfil}
              alt={currentUser.nome}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-rose-500/40 shadow-lg"
            />
            <button
              type="button"
              onClick={() => avatarFileInputRef.current?.click()}
              title="Trocar foto de perfil do seu computador/celular"
              className="absolute -bottom-2 -right-2 px-2.5 py-1.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl shadow-md hover:scale-105 transition flex items-center gap-1 text-[10px] font-bold"
            >
              <Camera size={13} />
              <span>Trocar Foto</span>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {currentUser.nome}
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300">
                {currentUser.idade} anos
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-rose-500" />
                {currentUser.cidade || 'Lages - SC'}
              </span>
              {currentUser.profissao && (
                <span className="flex items-center gap-1">
                  <Briefcase size={12} className="text-orange-500" />
                  {currentUser.profissao}
                </span>
              )}
            </div>

            {currentUser.email && (
              <p className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <Mail size={11} /> {currentUser.email}
              </p>
            )}

            {/* Desejo do Dia Badge */}
            {currentUser.desejoDoDia && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                <Flame size={12} className="text-orange-500" />
                <span>Desejo de hoje: {currentUser.desejoDoDia}</span>
              </div>
            )}
          </div>

          {/* Botão Editar Perfil */}
          <div className="flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Edit3 size={14} />
              {isEditing ? 'Fechar Edição' : 'Editar Perfil'}
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                title="Sair ou trocar de conta"
              >
                <LogOut size={13} />
                <span>Sair / Trocar</span>
              </button>
            )}
          </div>
        </div>

        {/* Biografia em Destaque */}
        <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              📝 Minha Biografia
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-[11px] font-bold text-rose-500 hover:underline"
            >
              Editar bio
            </button>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed italic">
            "{currentUser.bio || 'Adicione uma biografia contanto seus pratos e lugares favoritos!'}"
          </p>
        </div>

        {/* Destaques Gastronômicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/30">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              🍝 Prato Favorito
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {currentUser.pratoFavorito || 'Risoto de Funghi'}
            </p>
          </div>

          <div className="p-3 bg-orange-50/60 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
              📍 Restaurante Queridinho
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {currentUser.restauranteFavorito || 'Trattoria Bella Napoli'}
            </p>
          </div>
        </div>

        {/* Minhas Culinárias Favoritas */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Minhas Preferências Culinárias:
          </h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = currentUser.preferencias?.includes(cat.id);
              return (
                <span
                  key={cat.id}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <span>{cat.icone}</span>
                  <span>{cat.nome}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Formulário Completo de Edição (Foto, Bio, Dados e Paladar) */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-500/40 p-6 shadow-xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 size={16} className="text-rose-500" />
              Editar Foto, Biografia & Preferências
            </h3>
            <span className="text-[10px] font-bold text-rose-500 uppercase">Modo Edição</span>
          </div>

          {/* Edição da Foto de Perfil */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              📸 Alterar Foto de Perfil:
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={formData.fotoPerfil}
                alt="Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500 shadow"
              />
              <div className="flex-1 space-y-2 w-full">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Upload size={13} /> Enviar Foto do Dispositivo
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.fotoPerfil.startsWith('data:') ? '' : formData.fotoPerfil}
                  onChange={(e) => setFormData({ ...formData, fotoPerfil: e.target.value })}
                  placeholder="Ou cole a URL de uma foto aqui..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                />
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Sugeridas:</span>
                  {presetAvatars.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, fotoPerfil: av.url })}
                      className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition ${
                        formData.fotoPerfil === av.url
                          ? 'border-rose-500 scale-110'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome Completo:
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Idade:
              </label>
              <input
                type="number"
                value={formData.idade}
                onChange={(e) =>
                  setFormData({ ...formData, idade: parseInt(e.target.value, 10) || 18 })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cidade:
              </label>
              <input
                type="text"
                value={formData.cidade || ''}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="Ex: Lages - SC"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Profissão / Curso:
              </label>
              <input
                type="text"
                value={formData.profissao || ''}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                placeholder="Ex: Estudante de Ciência da Computação"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Biografia com gerador de sugestões */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Biografia / Apresentação Gastronômica:
              </label>
              <button
                type="button"
                onClick={handleSuggestBio}
                className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
              >
                <Sparkles size={12} /> Sugerir Bio
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Escreva sobre você, seus hobbies e que tipo de comida não pode faltar no encontro perfeito..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                🍝 Prato Favorito:
              </label>
              <input
                type="text"
                value={formData.pratoFavorito || ''}
                onChange={(e) => setFormData({ ...formData, pratoFavorito: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                📍 Restaurante Favorito:
              </label>
              <input
                type="text"
                value={formData.restauranteFavorito || ''}
                onChange={(e) => setFormData({ ...formData, restauranteFavorito: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                🔥 Desejo de Hoje:
              </label>
              <input
                type="text"
                value={formData.desejoDoDia || ''}
                onChange={(e) => setFormData({ ...formData, desejoDoDia: e.target.value })}
                placeholder="Ex: 🍣 Sushi & Drinks"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Seleção Interativa de Culinárias */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Selecione suas afinidades gastronômicas (usadas no cálculo de Match):
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = formData.preferencias?.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.icone}</span>
                    <span>{cat.nome}</span>
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <Save size={14} /> Salvar Alterações
            </button>
          </div>
        </form>
      )}

      {/* Galeria de Fotos do Perfil & Pratos Favoritos */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={16} className="text-rose-500" />
              Meu Álbum de Fotos & Momentos Gastronômicos ({userGallery.length})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Adicione fotos suas ou dos seus pratos favoritos. Clique em uma foto para defini-la como principal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => galleryFileInputRef.current?.click()}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-rose-200 dark:border-rose-800 transition shrink-0"
          >
            <Plus size={14} /> Enviar Nova Foto
          </button>
        </div>

        {/* Grid de Fotos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userGallery.map((photo, index) => {
            const isMain = photo === currentUser.fotoPerfil;
            return (
              <div
                key={index}
                className={`relative group h-36 rounded-2xl overflow-hidden border-2 transition ${
                  isMain
                    ? 'border-rose-500 shadow-md shadow-rose-500/15'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isMain && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-rose-500 text-white text-[9px] font-black uppercase shadow">
                    Foto Principal
                  </span>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  {!isMain && (
                    <button
                      type="button"
                      onClick={() => handleSetMainPhoto(photo)}
                      className="px-2.5 py-1.5 bg-white text-slate-900 rounded-xl text-[10px] font-bold shadow hover:bg-rose-500 hover:text-white transition"
                    >
                      Usar no Perfil
                    </button>
                  )}
                  {userGallery.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryPhoto(photo)}
                      className="p-1.5 bg-rose-600 text-white rounded-xl shadow hover:bg-rose-700 transition"
                      title="Remover foto"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Adicionar Foto por URL */}
        <form onSubmit={handleAddGalleryUrl} className="flex gap-2 pt-1">
          <input
            type="url"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder="Ou cole o link (URL) de uma foto sua ou de um prato..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:opacity-90 transition shrink-0"
          >
            Adicionar URL
          </button>
        </form>
      </div>
    </div>
  );
}
