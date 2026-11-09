import React, { useState } from 'react';
import { Search, Star, MapPin, Clock, ChevronDown, ChevronUp, CalendarPlus, Utensils, Filter } from 'lucide-react';

export default function RestaurantCatalog({ restaurants, categories, onSelectRestaurantToDate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Todos');
  const [expandedMenuId, setExpandedMenuId] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'distance'

  // Filtragem
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cardapio.some((item) => item.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todas' ||
      r.categoria.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesPrice =
      selectedPriceRange === 'Todos' || r.faixaPreco === selectedPriceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.avaliacao - a.avaliacao;
    return a.distanciaKm - b.distanciaKm;
  });

  const toggleMenu = (id) => {
    setExpandedMenuId(expandedMenuId === id ? null : id);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-rose-600 rounded-3xl p-5 text-white shadow-lg shadow-rose-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>🛵</span> Módulo Gastronômico iFood
            </div>
            <h2 className="text-2xl font-black tracking-tight">Onde será o próximo date?</h2>
            <p className="text-xs text-orange-100 max-w-sm">
              Escolha os melhores restaurantes da cidade para convidar seu match e viver uma experiência inesquecível.
            </p>
          </div>
          <div className="text-4xl hidden sm:block">
            🍣🍕
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar restaurante, tipo de comida ou prato..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition"
        />
      </div>

      {/* Categorias de Culinária (Chips Roláveis) */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button
          onClick={() => setSelectedCategory('Todas')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedCategory === 'Todas'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🍽️ Todas as Culinárias
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.nome)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === cat.nome
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{cat.icone}</span>
            <span>{cat.nome}</span>
          </button>
        ))}
      </div>

      {/* Filtros Rápidos de Preço e Ordenação */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Faixa:</span>
          {['Todos', '$', '$$', '$$$', '$$$$'].map((price) => (
            <button
              key={price}
              onClick={() => setSelectedPriceRange(price)}
              className={`px-2 py-0.5 rounded-lg font-bold ${
                selectedPriceRange === price
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300'
              }`}
            >
              {price}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy(sortBy === 'rating' ? 'distance' : 'rating')}
            className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            <Filter size={12} />
            {sortBy === 'rating' ? 'Melhor Avaliados' : 'Mais Próximos'}
          </button>
        </div>
      </div>

      {/* Lista de Restaurantes */}
      <div className="space-y-4">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-bold text-slate-700 dark:text-slate-200">Nenhum restaurante encontrado</p>
            <p className="text-xs text-slate-400">Tente buscar por outro termo ou categoria.</p>
          </div>
        ) : (
          filteredRestaurants.map((res) => {
            const isMenuOpen = expandedMenuId === res.id;
            return (
              <div
                key={res.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition"
              >
                {/* Imagem de Capa do Restaurante */}
                <div className="relative h-44 w-full bg-slate-800">
                  <img
                    src={res.imagemUrl}
                    alt={res.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Badge de Avaliação */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-amber-500 shadow">
                    <Star size={13} className="fill-amber-400" />
                    <span>{res.avaliacao}</span>
                  </div>

                  {/* Categoria e Faixa de Preço */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow">
                      {res.categoria}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
                      {res.faixaPreco}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Restaurante */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                        {res.nome}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {res.descricao}
                      </p>
                    </div>
                  </div>

                  {/* Metadados: Endereço e Horário */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={13} className="text-rose-500" />
                      <span>{res.distanciaKm} km • {res.endereco}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={13} className="text-orange-500" />
                      <span>{res.horario}</span>
                    </div>
                  </div>

                  {/* Cardápio Resumido Expansível */}
                  {isMenuOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Utensils size={14} className="text-rose-500" />
                          Pratos do Cardápio para o Encontro
                        </h4>
                        <span className="text-[10px] text-slate-400">Preços aproximados</span>
                      </div>

                      <div className="grid gap-2">
                        {res.cardapio.map((dish) => (
                          <div
                            key={dish.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between border border-slate-100 dark:border-slate-800"
                          >
                            <div className="pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                  {dish.nome}
                                </span>
                                {dish.emDestaque && (
                                  <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded">
                                    TOP DATE
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {dish.descricao}
                              </p>
                            </div>
                            <span className="text-xs font-black text-rose-600 dark:text-rose-400 whitespace-nowrap">
                              R$ {dish.preco.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => toggleMenu(res.id)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1"
                    >
                      {isMenuOpen ? (
                        <>Ocultar Cardápio <ChevronUp size={14} /></>
                      ) : (
                        <>Ver Cardápio ({res.cardapio.length}) <ChevronDown size={14} /></>
                      )}
                    </button>

                    <button
                      onClick={() => onSelectRestaurantToDate(res)}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 transition"
                    >
                      <CalendarPlus size={14} />
                      Convidar Match para este Local
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
