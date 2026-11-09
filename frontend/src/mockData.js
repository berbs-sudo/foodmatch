// Fallback e Mock Data para o frontend FoodMatch (Tinder + iFood)

export const initialCategories = [
  { id: 1, nome: "Italiana", icone: "🍕", slug: "italiana" },
  { id: 2, nome: "Japonesa", icone: "🍣", slug: "japonesa" },
  { id: 3, nome: "Hambúrguer", icone: "🍔", slug: "hamburguer" },
  { id: 4, nome: "Vegana / Saudável", icone: "🥗", slug: "vegana" },
  { id: 5, nome: "Mexicana", icone: "🌮", slug: "mexicana" },
  { id: 6, nome: "Churrasco", icone: "🥩", slug: "churrasco" },
  { id: 7, nome: "Doces & Cafés", icone: "☕", slug: "cafes" },
  { id: 8, nome: "Comida de Boteco", icone: "🍻", slug: "boteco" },
];

export const presetAvatars = [
  {
    label: "Avatar 1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Avatar 2",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Avatar 3",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Avatar 4",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Avatar 5",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Avatar 6",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
];

export const bioSuggestions = [
  "Apaixonado(a) por massas artesanais, vinhos secos e conversas longas sobre tecnologia e gastronomia. Bora dividir uma entrada?",
  "Se tiver lámen quentinho, sushi fresco ou um café especial no fim da tarde, já ganhou meu coração! 🍣☕",
  "Em busca da melhor hamburgueria artesanal da cidade e de uma boa companhia para dividir batata trufada. 🍔✨",
  "Acredito que o melhor encontro começa com um bom cardápio e termina com sobremesa compartilhada! 🍰🍷",
];

export const initialCurrentUser = {
  id: 1,
  nome: "Bernardo Silva",
  email: "bernardo@unifacvest.edu.br",
  idade: 22,
  cidade: "Lages - SC",
  profissao: "Estudante de Ciência da Computação",
  bio: "Estudante de Ciência da Computação na UNIFACVEST. Fanático por massas artesanais, vinhos secos e conversas longas sobre tecnologia e gastronomia.",
  fotoPerfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  fotos: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
  ],
  pratoFavorito: "Risoto de Funghi com Parmesão",
  restauranteFavorito: "Trattoria Bella Napoli",
  desejoDoDia: "🍕 Massa artesanal & Vinho tinto",
  preferencias: [1, 2, 7], // Italiana, Japonesa, Cafés
};

export const initialFeedUsers = [
  {
    id: 2,
    nome: "Camila Fernandes",
    email: "camila.arq@email.com",
    idade: 24,
    cidade: "Lages - SC",
    profissao: "Arquiteta & Urbanista",
    distanciaKm: 1.5,
    compatibilidade: 96,
    bio: "Arquiteta apaixonada por cafés aconchegantes e gastronomia oriental. Se tiver lámen ou sashimi fresco, já me ganhou!",
    fotoPerfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    ],
    pratoFavorito: "Tonkotsu Lámen Especial & Hot Roll",
    restauranteFavorito: "Sushi Zen Nikkei Lounge",
    desejoDoDia: "🍣 Combinado de Salmão Trufado",
    preferencias: [2, 7, 1],
    culinariasEmComum: ["Japonesa", "Doces & Cafés", "Italiana"]
  },
  {
    id: 3,
    nome: "Lucas Mendes",
    email: "lucas.mendes@email.com",
    idade: 26,
    cidade: "Lages - SC",
    profissao: "Designer de Produto",
    distanciaKm: 2.8,
    compatibilidade: 88,
    bio: "Sommelier amador e entusiasta de hambúrguer artesanal no ponto certo. Procuro alguém pra dividir batata rústica com maionese trufada.",
    fotoPerfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    ],
    pratoFavorito: "Smash Burger Duplo com Queijo Brie",
    restauranteFavorito: "Burger Garage & Smokehouse",
    desejoDoDia: "🍔 Smash Burger na Brasa",
    preferencias: [3, 6, 8],
    culinariasEmComum: ["Hambúrguer", "Comida de Boteco"]
  },
  {
    id: 4,
    nome: "Isabela Rocha",
    email: "isabela.nutri@email.com",
    idade: 23,
    cidade: "Lages - SC",
    profissao: "Nutricionista",
    distanciaKm: 3.2,
    compatibilidade: 91,
    bio: "Nutricionista e adepta da culinária plant-based colorida e cheia de sabor. Amo descobrir bistrôs charmosos e cafés tranquilos.",
    fotoPerfil: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    ],
    pratoFavorito: "Bowl Thai com Tofu Grelhado e Molho de Amendoim",
    restauranteFavorito: "Green Soul Bistrô Vegano",
    desejoDoDia: "🥗 Bistrô Orgânico & Matcha Latte",
    preferencias: [4, 7, 2],
    culinariasEmComum: ["Doces & Cafés", "Japonesa"]
  },
  {
    id: 5,
    nome: "Gabriel Siqueira",
    email: "gabriel.siqueira@email.com",
    idade: 25,
    cidade: "Lages - SC",
    profissao: "Engenheiro Civil",
    distanciaKm: 4.0,
    compatibilidade: 84,
    bio: "Amante da gastronomia mexicana com muita pimenta e drinks refrescantes! Bora de tacos e uma margarita gelada para quebrar o gelo?",
    fotoPerfil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    ],
    pratoFavorito: "Tacos Al Pastor com Guacamole Fresco",
    restauranteFavorito: "Cantina Jalisco Mexican Food",
    desejoDoDia: "🌮 Noite de Tacos & Margaritas",
    preferencias: [5, 8, 3],
    culinariasEmComum: ["Mexicana", "Comida de Boteco"]
  },
  {
    id: 6,
    nome: "Mariana Alencar",
    email: "mariana.chef@email.com",
    idade: 27,
    cidade: "Lages - SC",
    profissao: "Chef Confeiteira",
    distanciaKm: 1.8,
    compatibilidade: 98,
    bio: "Chef confeiteira. A vida é curta demais para não pedir sobremesa primeiro. Procuro um parceiro de degustação de fondues e massas.",
    fotoPerfil: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    ],
    pratoFavorito: "Fettuccine Alfredo e Torta Folhada de Pistache",
    restauranteFavorito: "Trattoria Bella Napoli",
    desejoDoDia: "☕ Fondue de Chocolate Belga",
    preferencias: [1, 7, 4],
    culinariasEmComum: ["Italiana", "Doces & Cafés"]
  }
];

export const initialRestaurants = [
  {
    id: 1,
    nome: "Trattoria Bella Napoli",
    descricao: "Massas frescas produzidas artesanalmente todos os dias com receitas tradicionais do sul da Itália e carta de vinhos selecionada.",
    categoria: "Italiana",
    categoriaId: 1,
    faixaPreco: "$$$",
    avaliacao: 4.9,
    distanciaKm: 1.2,
    tempoEntrega: "40-50 min",
    imagemUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    endereco: "Rua Correia Pinto, 340 - Centro",
    horario: "Terça a Domingo • 19:00 - 23:30",
    telefone: "(49) 3221-5050",
    cardapio: [
      { id: 101, nome: "Fettuccine ao Tartufo & Cogumelos", descricao: "Massa fresca salteada na manteiga trufada com mix de cogumelos frescos e lascas de parmesão.", preco: 68.0, emDestaque: true },
      { id: 102, nome: "Risoto Alla Milanese com Ossobuco", descricao: "Arroz arbóreo com açafrão verdadeiro, servido com corte nobre de ossobuco cozido lentamente.", preco: 84.0, emDestaque: true },
      { id: 103, nome: "Tiramisù Clássico Italiano", descricao: "Biscoito champagne embebido em café espresso, camadas de queijo mascarpone e cacau belga 70%.", preco: 28.0, emDestaque: false },
    ]
  },
  {
    id: 2,
    nome: "Sushi Zen Nikkei Lounge",
    descricao: "Experiência gastronômica sofisticada unindo o rigor da culinária tradicional japonesa com toques da cozinha contemporânea Nikkei.",
    categoria: "Japonesa",
    categoriaId: 2,
    faixaPreco: "$$$$",
    avaliacao: 4.8,
    distanciaKm: 2.1,
    tempoEntrega: "35-45 min",
    imagemUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    endereco: "Av. Belisário Ramos, 1120 - Copacabana",
    horario: "Todos os dias • 18:30 - 23:45",
    telefone: "(49) 3224-8899",
    cardapio: [
      { id: 201, nome: "Combo Zen Especial (24 peças)", descricao: "Sashimis de salmão trufado, nigiris de atum com foie gras, joy de brie com geleia de pimenta.", preco: 110.0, emDestaque: true },
      { id: 202, nome: "Tonkotsu Lámen Kurobuta", descricao: "Caldo encorpado cozido por 16h, chashu de porco marinado, ovo ajitama e massa artesanal.", preco: 52.0, emDestaque: true },
      { id: 203, nome: "Ceviche Nikkei de Frutos do Mar", descricao: "Salmão, polvo e peixe branco ao leite de tigre com milho crocante e batata-doce glaceada.", preco: 46.0, emDestaque: false }
    ]
  },
  {
    id: 3,
    nome: "Burger Garage & Smokehouse",
    descricao: "Hambúrgueres artesanais na brasa, defumados no pátio estilo texano, cervejas artesanais locais e ambiente rústico intimista.",
    categoria: "Hambúrguer",
    categoriaId: 3,
    faixaPreco: "$$",
    avaliacao: 4.7,
    distanciaKm: 0.8,
    tempoEntrega: "25-35 min",
    imagemUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    endereco: "Rua Benjamin Constant, 185 - Coral",
    horario: "Quarta a Domingo • 18:00 - 00:00",
    telefone: "(49) 3223-1020",
    cardapio: [
      { id: 301, nome: "Smoked Bacon Melt Burger", descricao: "Blend angus 180g na brasa, queijo cheddar inglês, bacon caramelizado no melaço e molho especial.", preco: 38.0, emDestaque: true },
      { id: 302, nome: "Brisket Sandwich Defumado", descricao: "Peito bovino defumado por 12 horas em lenha de macieira, coleslaw e barbecue artesanal.", preco: 44.0, emDestaque: true },
      { id: 303, nome: "Batata Trufada com Alecrim", descricao: "Batata rústica crocante aromatizada com azeite trufado e queijo grana padano ralado na hora.", preco: 26.0, emDestaque: false }
    ]
  },
  {
    id: 4,
    nome: "Green Soul Bistrô Vegano",
    descricao: "Culinária 100% à base de plantas, orgânica, colorida e acolhedora. Sobremesas sem glúten e sem lactose surpreendentes.",
    categoria: "Vegana / Saudável",
    categoriaId: 4,
    faixaPreco: "$$",
    avaliacao: 4.9,
    distanciaKm: 1.8,
    tempoEntrega: "30-40 min",
    imagemUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    endereco: "Rua Nereu Ramos, 450 - Centro",
    horario: "Terça a Sábado • 11:30 - 22:00",
    telefone: "(49) 3225-7744",
    cardapio: [
      { id: 401, nome: "Moqueca Vegana de Cogumelos e Palmito", descricao: "Caldo aromático de coco e dendê com pupunha fresca, mix de cogumelos, arroz vermelho e farofa.", preco: 48.0, emDestaque: true },
      { id: 402, nome: "Bowl Thai Proteico", descricao: "Tofu grelhado em crosta de gergelim, quinoa, abacate, edamame fresco e molho cremoso de amendoim.", preco: 42.0, emDestaque: true },
      { id: 403, nome: "Cheesecake Raw de Frutas Vermelhas", descricao: "Base crocante de castanhas e tâmaras com creme de castanha-de-caju e calda de amoras frescas.", preco: 22.0, emDestaque: false }
    ]
  },
  {
    id: 5,
    nome: "Cantina Jalisco Mexican Food",
    descricao: "Sabor autêntico do México com guacamole feito na mesa, tacos artesanais, quesadillas e drinks especiais para brindar a dois.",
    categoria: "Mexicana",
    categoriaId: 5,
    faixaPreco: "$$",
    avaliacao: 4.6,
    distanciaKm: 3.0,
    tempoEntrega: "30-45 min",
    imagemUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    endereco: "Av. Duque de Caxias, 780 - Universitário",
    horario: "Quarta a Segunda • 19:00 - 23:30",
    telefone: "(49) 3227-3311",
    cardapio: [
      { id: 501, nome: "Trio de Tacos Jalisco", descricao: "Carnitas bovina desfiada, frango marinado no chipotle e pastor com abacaxi na tortilla de milho nixtamalizada.", preco: 45.0, emDestaque: true },
      { id: 502, nome: "Guacamole Especial para Compartilhar", descricao: "Abacate fresco temperado com coentro, pico de gallo e limão taiti, acompanhado de totopos quentinhos.", preco: 32.0, emDestaque: true }
    ]
  },
  {
    id: 6,
    nome: "Café & Confeitaria Parisienne",
    descricao: "O charme dos cafés de Paris com croissants folhados na manteiga, éclairs finas, cafés especiais filtrados e fondue no inverno.",
    categoria: "Doces & Cafés",
    categoriaId: 7,
    faixaPreco: "$$",
    avaliacao: 4.9,
    distanciaKm: 1.0,
    tempoEntrega: "20-30 min",
    imagemUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    endereco: "Praça João Costa, 75 - Calçadão Centro",
    horario: "Segunda a Sábado • 09:00 - 21:00",
    telefone: "(49) 3222-9012",
    cardapio: [
      { id: 601, nome: "Fondue Suíço Doce para Dois", descricao: "Chocolate belga meio amargo derretido com morangos frescos, uvas sem semente, bananas e mini waffles.", preco: 62.0, emDestaque: true },
      { id: 602, nome: "Croissant Recheado de Brie e Mel", descricao: "Massa folhada francesa quentinha recheada com generosa fatia de queijo brie, mel silvestre e nozes.", preco: 29.0, emDestaque: true }
    ]
  }
];

export const initialMatches = [
  {
    id: 1,
    partner: {
      id: 2,
      nome: "Camila Fernandes",
      idade: 24,
      cidade: "Lages - SC",
      fotoPerfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      bio: "Arquiteta apaixonada por cafés aconchegantes e gastronomia oriental. Se tiver lámen ou sashimi fresco, já me ganhou!",
      pratoFavorito: "Tonkotsu Lámen Especial & Hot Roll",
      restauranteFavorito: "Sushi Zen Nikkei Lounge",
    },
    compatibilidade: 96,
    culinariasEmComum: ["Japonesa", "Doces & Cafés", "Italiana"],
    matchDate: "Hoje às 14:30",
    status: "ACTIVE",
    ultimaMensagem: "Que tal irmos juntos nesta sexta às 20h provar o Tonkotsu Lámen?"
  }
];

export const initialMessages = [
  {
    id: 1,
    matchId: 1,
    senderId: 2,
    texto: "Oi Bernardo! Vi que você também é fã de gastronomia e comida oriental! 🍣",
    tipo: "TEXT",
    horario: "14:32",
  },
  {
    id: 2,
    matchId: 1,
    senderId: 1,
    texto: "Oi Camila! Sim, não resisto a um bom lámen e adoro a culinária italiana também. Tudo bem com você?",
    tipo: "TEXT",
    horario: "14:35",
  },
  {
    id: 3,
    matchId: 1,
    senderId: 2,
    texto: "Tudo ótimo! Você já foi ao Sushi Zen Nikkei aqui perto do centro? Dizem que o festival deles é sensacional!",
    tipo: "TEXT",
    horario: "14:38",
  }
];

export const initialInvites = [
  {
    id: 1,
    matchId: 1,
    inviterId: 1,
    inviteeId: 2,
    restauranteId: 2,
    restauranteNome: "Sushi Zen Nikkei Lounge",
    restauranteImagem: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    endereco: "Av. Belisário Ramos, 1120 - Copacabana",
    dataEncontro: "Sexta-feira, 31 de Outubro",
    horario: "20:00",
    mensagem: "Que tal irmos juntos nesta sexta às 20h provar o Tonkotsu Lámen e uns sushis?",
    status: "PENDING", // PENDING, ACCEPTED, REJECTED, RESCHEDULED
    createdAt: new Date().toISOString()
  }
];
