import React, { useState, useRef } from 'react';
import { X, Heart, Star, MapPin, Sparkles, Utensils, RotateCcw, Briefcase, Flame } from 'lucide-react';

export default function SwipeCard({ profiles, onSwipe, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);

  const currentProfile = profiles[currentIndex];
  const profilePhotos =
    currentProfile?.fotos?.length > 0
      ? currentProfile.fotos
      : currentProfile
      ? [currentProfile.fotoPerfil]
      : [];

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    cardRef.current.startX = touch.clientX;
    cardRef.current.startY = touch.clientY;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - cardRef.current.startX;
    const diffY = touch.clientY - cardRef.current.startY;
    setDragOffset({ x: diffX, y: diffY });

    if (diffX > 60) setSwipeDirection('right');
    else if (diffX < -60) setSwipeDirection('left');
    else setSwipeDirection(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset.x > 100) {
      triggerSwipe('right');
    } else if (dragOffset.x < -100) {
      triggerSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    cardRef.current.startX = e.clientX;
    cardRef.current.startY = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - cardRef.current.startX;
    const diffY = e.clientY - cardRef.current.startY;
    setDragOffset({ x: diffX, y: diffY });

    if (diffX > 60) setSwipeDirection('right');
    else if (diffX < -60) setSwipeDirection('left');
    else setSwipeDirection(null);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset.x > 100) {
      triggerSwipe('right');
    } else if (dragOffset.x < -100) {
      triggerSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }
  };

  const triggerSwipe = (direction) => {
    const isLike = direction === 'right' || direction === 'super';
    setDragOffset({
      x: direction === 'right' ? 500 : direction === 'left' ? -500 : 0,
      y: direction === 'super' ? -500 : 0
    });

    setTimeout(() => {
      onSwipe(currentProfile, isLike ? (direction === 'super' ? 'SUPERLIKE' : 'LIKE') : 'DISLIKE');
      setCurrentIndex((prev) => prev + 1);
      setPhotoIndex(0);
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }, 250);
  };

  if (!currentProfile || currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[520px] text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm mx-auto">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/60 text-rose-500 rounded-full flex items-center justify-center text-4xl mb-4 animate-bounce">
          🍽️
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          Você viu todos os foodies por perto!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
          Ajuste seus filtros de culinária ou volte mais tarde para descobrir novos parceiros de gastronomia.
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setPhotoIndex(0);
            if (onReset) onReset();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/25 hover:opacity-95 transition"
        >
          <RotateCcw size={18} />
          Reiniciar Feed de Descoberta
        </button>
      </div>
    );
  }

  // Calculate card transform
  const rotation = dragOffset.x * 0.08;
  const cardStyle = {
    transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  const activePhotoUrl = profilePhotos[photoIndex] || currentProfile.fotoPerfil;

  return (
    <div className="relative w-full max-w-sm mx-auto select-none pb-4">
      {/* Background Deck Card Shadow Effect */}
      {profiles[currentIndex + 1] && (
        <div className="absolute inset-0 top-3 scale-[0.96] rounded-3xl bg-slate-200 dark:bg-slate-800 opacity-60 pointer-events-none -z-10 shadow-md" />
      )}

      {/* Main Interactive Card */}
      <div
        ref={cardRef}
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 cursor-grab active:cursor-grabbing"
      >
        {/* Swipe Indicators Overlay */}
        {swipeDirection === 'right' && (
          <div className="absolute top-10 left-6 z-20 border-4 border-emerald-500 text-emerald-500 font-extrabold text-2xl px-4 py-1.5 rounded-2xl rotate-[-15deg] bg-emerald-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
            DEU FOME! ❤️
          </div>
        )}
        {swipeDirection === 'left' && (
          <div className="absolute top-10 right-6 z-20 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl px-4 py-1.5 rounded-2xl rotate-[15deg] bg-rose-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
            PASSO ❌
          </div>
        )}

        {/* Profile Image with Multi-Photo Tinder Bars & Gradient */}
        <div className="relative h-96 w-full overflow-hidden bg-slate-900">
          {/* Barras de Progresso de Fotos no Topo (Estilo Tinder) */}
          {profilePhotos.length > 1 && (
            <div className="absolute top-2.5 left-4 right-4 z-20 flex gap-1.5">
              {profilePhotos.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex(idx);
                  }}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx === photoIndex ? 'bg-white shadow' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          <img
            src={activePhotoUrl}
            alt={currentProfile.nome}
            className="w-full h-full object-cover pointer-events-none transition-all duration-300"
            draggable="false"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

          {/* Gastronomic Affinity Match Badge */}
          <div className="absolute top-6 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-amber-300 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-300/30">
            <Sparkles size={14} className="text-amber-400" />
            <span>{currentProfile.compatibilidade || 92}% Match de Paladar</span>
          </div>

          {/* Quick Distance Badge */}
          <div className="absolute top-6 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
            <MapPin size={12} className="text-rose-400" />
            <span>{currentProfile.distanciaKm || 1.5} km</span>
          </div>

          {/* Header Info on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black tracking-tight">{currentProfile.nome}</h2>
              <span className="text-xl font-light text-slate-300">{currentProfile.idade}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-rose-400" /> {currentProfile.cidade || 'Lages - SC'}
              </span>
              {currentProfile.profissao && (
                <span className="flex items-center gap-1">
                  <Briefcase size={11} className="text-amber-300" /> {currentProfile.profissao}
                </span>
              )}
            </div>

            {/* Favorite Cuisines Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(currentProfile.culinariasEmComum || ['Italiana', 'Japonesa']).map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Body - Gastronomic Highlights & Bio */}
        <div className="p-4 space-y-3 bg-white dark:bg-slate-900 transition-colors">
          {/* Favorite Dish & Restaurant Callouts */}
          <div className="bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl p-3 border border-rose-100 dark:border-rose-900/50">
            <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Utensils size={13} /> O que ama comer:
              </span>
              {currentProfile.desejoDoDia && (
                <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 normal-case flex items-center gap-1">
                  <Flame size={11} /> {currentProfile.desejoDoDia}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              "{currentProfile.pratoFavorito || 'Massa fresca e risoto de cogumelos'}"
            </p>
            {currentProfile.restauranteFavorito && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                📍 Lugar favorito: <strong className="text-slate-700 dark:text-slate-200">{currentProfile.restauranteFavorito}</strong>
              </p>
            )}
          </div>

          {/* Bio Description */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentProfile.bio}
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {/* Dislike / Pass Button */}
          <button
            onClick={() => triggerSwipe('left')}
            className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-rose-500 shadow-md border border-rose-100 dark:border-slate-700 flex items-center justify-center hover:scale-110 active:scale-95 transition"
            title="Passar (Swipe para Esquerda)"
          >
            <X size={26} strokeWidth={2.5} />
          </button>

          {/* Super Like / Estrela Gastronômica */}
          <button
            onClick={() => triggerSwipe('super')}
            className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-amber-500 shadow-md border border-amber-100 dark:border-slate-700 flex items-center justify-center hover:scale-110 active:scale-95 transition"
            title="Super Like Gastronômico"
          >
            <Star size={22} className="fill-amber-400" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => triggerSwipe('right')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition"
            title="Deu Fome! Curtir (Swipe para Direita)"
          >
            <Heart size={26} strokeWidth={2.5} className="fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
