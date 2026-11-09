# 🤖 Documentação Analítica de Engenharia de Prompts e Uso de IA

> **Disciplina:** Laboratório de Programação — Ciência da Computação (UNIFACVEST)  
> **Professor:** Willen Leolatto Carneiro  
> **Integrantes da Dupla:** Bernardo Silva e `[Nome do Integrante 2]`  
> **Agente(s) de IA Utilizado(s):** Google Antigravity (Powered by Gemini 3.8)

---

## 🎯 1. Objetivo deste Documento
Em conformidade com as diretrizes de Engenharia de Software da disciplina, este documento formaliza o papel ativo da dupla como **Revisores Críticos de Código (*Code Reviewers*)** e **Arquitetos de Software**. Ele mapeia a jornada de engenharia de prompts utilizada para construir o **FoodMatch (Tinder + iFood)**, explicitando os prompts arquiteturais formulados, as iterações de refinamento técnico exigidas da IA e os critérios de validação adotados para aprovar cada componente do sistema.

---

## 📋 2. Matriz de Rastreabilidade e Decisões de Engenharia

| Problema / Requisito | Prompts Utilizados | Refinamento (Iterações) | Decisão de Engenharia |
| :--- | :--- | :--- | :--- |
| **1. Concepção Full Stack e Fusão dos Domínios** | *"Atue como um Engenheiro Full Stack e Arquiteto de Software. Crie a estrutura de um sistema em Node.js (v22/v24) e React que una a mecânica de encontros do Tinder com o catálogo gastronômico do iFood. Separe as camadas em controllers, routes, database e frontend com Vite e Tailwind CSS."* | Na 1ª geração, a IA sugeriu criar duas aplicações completamente separadas sem proxy reverso. Refinamos para unificar o gerenciamento via root com `concurrently` e criamos o fallback gracioso com dados locais realistas para resiliência caso o banco esteja desligado. | Aprovamos a **arquitetura desacoplada** com API RESTful no backend Express e SPA em React 19 no frontend, garantindo que o protótipo possa ser testado tanto em modo Full Stack integrado quanto client-side. |
| **2. Modelagem Relacional de Domínio e Prisma ORM** | *"Escreva o schema.prisma no PostgreSQL para o FoodMatch. O modelo deve contemplar: Usuários, Categorias Culinárias, Preferências Gastronômicas (N:M), Restaurantes, Itens de Cardápio (1:N), Matches mútuos, Mensagens e Convites de Encontro (DateInvite) com status negociável."* | A primeira versão utilizou tipos genéricos em texto para o status do convite e não preveniu a deleção em cascata perigosa de restaurantes. Solicitamos a restrição `onDelete: Restrict` para estabelecimentos e modelamos o `DateInvite` vinculado diretamente ao `Match`. | **Integridade Referencial Estrita:** Garante que restaurantes com encontros agendados não possam ser excluídos do banco, preservando o histórico do casal e garantindo coerência nos dados acadêmicos. |
| **3. Mecânica de Descoberta (Swipe Engine Mobile-First)** | *"Crie um componente React de Swipe estilo Tinder para o FoodMatch. O card deve exibir a foto em alta qualidade, idade, distância, badge de afinidade gastronômica, prato favorito e botões arredondados de Passar (X), Super Like e Curtir (Coração). Adicione gestos de arrasto e modal comemorativo de Match com confetes."* | Inicialmente, o componente utilizava uma biblioteca pesada de terceiros desatualizada para React 19. Refinamos exigindo uma implementação nativa e leve com `onTouchStart/Move/End` e `onMouseDown/Move/Up`, rotação angular proporcional ao arrasto e integração com `canvas-confetti`. | Aprovado pela **performance e independência de dependências frágeis**: o swipe funciona tanto via mouse no computador quanto por toque em smartphones com rotação fluida e feedback tátil/visual. |
| **4. Módulo de Restaurantes e Cardápio (O "iFood")** | *"Atuando como desenvolvedor frontend, construa o catálogo de restaurantes no estilo iFood. Deve conter barra de pesquisa rápida por prato ou restaurante, chips roláveis de categorias culinárias, filtros de faixa de preço ($ a $$$$), ordenação por avaliação e cardápio expansível com destaques."* | A IA havia gerado apenas uma lista estática sem visualização de cardápio. Exigimos uma nova iteração onde cada restaurante exibe seus pratos principais, preços e o botão de ação rápida 'Convidar Match para este Local', que transfere o restaurante diretamente para o modal de agendamento. | **UX Centrada na Tomada de Decisão:** Conectar a escolha do prato ao convite de encontro elimina o atrito do usuário e cumpre o objetivo central de unir os dois universos (paquera + comida). |
| **5. Sistema de Agendamento e Chat Interativo** | *"Implemente a integração entre o Chat de mensagens e o Sistema de Agendamento. Quando o usuário enviar um convite de encontro com restaurante, data e hora, o chat deve renderizar um card interativo com botões para 'Aceitar', 'Recusar' ou 'Propor outro horário', alterando o status reativamente."* | Na 1ª versão, o convite era enviado como texto puro na conversa. Refinamos exigindo um componente dedicado de Card de Convite dentro da thread com estados visuais distintos para Pendente (amarelo), Confirmado (verde com confetes) e Recusado. | **Padrão de Mensageria Interativa:** Aumenta a imersão do usuário e espelha o fluxo real de negociação de encontros com confirmação explícita de ambas as partes. |
| **6. Paleta Romântica, Tipografia e Dark Mode Nativo** | *"Configure o Tailwind CSS para o FoodMatch com uma paleta de cores apetitosa e romântica (tons de vermelho vibrante, laranja e branco) e suporte nativo a Dark Mode persistido no localStorage. Crie também um modo de moldura de celular para simular smartphone na tela."* | O tema inicial utilizava vermelhos muito escuros e sem contraste no modo escuro. Refinamos para Rose `#E11D48`, Flame Orange `#FF6B00` e fundos em Slate `#0F172A`, além de garantir a tipografia sem serifa 'Plus Jakarta Sans'. | **Acessibilidade e Identidade Visual Forte:** A paleta estimula o apetite visual ao mesmo tempo que mantém leitura clara e elegante tanto de dia quanto à noite. |

---

## 🛠️ 3. Catálogo de Prompts Prontos Utilizados no Projeto

Para fins de reprodução e auditoria docente, seguem os principais comandos consolidados utilizados durante o ciclo de desenvolvimento:

### 🔹 Prompt 1: Arquitetura e Modelagem do Prisma Schema
```text
Atue como um Arquiteto de Banco de Dados. Crie o arquivo schema.prisma conectando ao PostgreSQL via DATABASE_URL para a aplicação FoodMatch (Tinder + iFood).
Defina os seguintes modelos com mapeamento snake_case:
1. User (nome, email, bio, foto, cidade, pratoFavorito, restauranteFavorito);
2. GastronomicCategory (nome, icone);
3. UserPreference (relacionamento N:M entre User e GastronomicCategory);
4. Restaurant (nome, descricao, categoriaId, faixaPreco, avaliacao, distanciaKm, imagemUrl, endereco, horario);
5. MenuItem (restauranteId, nome, descricao, preco, emDestaque);
6. Match (user1Id, user2Id, status);
7. Message (matchId, senderId, texto, tipo);
8. DateInvite (matchId, restauranteId, inviterId, inviteeId, dataEncontro, horario, mensagem, status).
Adicione onDelete: Restrict para restaurantes e categorias para proteger a integridade referencial.
```

### 🔹 Prompt 2: API RESTful Express e Endpoints
```text
Crie os Controllers e Rotas REST no Express para o FoodMatch:
- /api/feed: retorna usuários ordenados por afinidade culinária com cálculo de % de match;
- /api/feed/swipe: processa likes/dislikes e gera o objeto de match comemorativo;
- /api/restaurants: lista estabelecimentos com filtros por texto, categoria, faixa de preço e ordenação;
- /api/matches e /api/matches/:id/messages: manipula conversas e envio de mensagens;
- /api/invites: cria convite de encontro e rota PUT /api/invites/:id/status para aceitar ou recusar.
Utilize o padrão Singleton para o Prisma Client e adicione tratamento seguro de erros com status semânticos.
```

### 🔹 Prompt 3: Componente SwipeCard Mobile-First em React
```text
Crie o componente SwipeCard.jsx em React utilizando Tailwind CSS e Lucide Icons.
Requisitos:
- Card com foto imersiva de alta qualidade, gradiente de fundo, nome, idade e distância em km;
- Tag destacada de % de compatibilidade gastronômica e lista de culinárias favoritas;
- Card de destaque com o 'Prato Favorito' e 'Lugar Favorito' da pessoa;
- Mecânica de arrasto (drag) por mouse e touch com rotação suave e badges dinâmicos de 'DEU FOME! ❤️' e 'PASSO ❌';
- Botões circulares flutuantes na base para Descarte, Super Like e Like;
- Tratamento de fim de deck com botão para reiniciar o feed.
```

### 🔹 Prompt 4: Módulo de Restaurantes e Cardápio iFood
```text
Crie o componente RestaurantCatalog.jsx no React estilo iFood para o FoodMatch:
- Barra de busca textual;
- Carrossel horizontal de categorias culinárias (Todas, Italiana, Japonesa, Hambúrguer, Vegana, Mexicana, Cafés);
- Filtro por faixa de preço ($ a $$$$) e ordenação por estrelas ou distância;
- Cada card de restaurante deve ter foto, avaliação, distância, endereço, botão para expandir o cardápio com preços e botão 'Convidar Match para este Local'.
```

### 🔹 Prompt 5: Chat com Convite Interativo de Encontro
```text
Construa a tela de ChatView.jsx que una conversa em tempo real com agendamento de encontros:
- Topo com carrossel horizontal dos Matches do usuário;
- Header com foto do match, status online e botão de destaque 'Convidar para Sair';
- Histórico de mensagens com balões de conversa estilizados e sugestões de quebra-gelo culinário;
- Card Interativo de Convite embutido no chat com foto do restaurante, endereço, data, horário e mensagem personalizada;
- Botões interativos no card para 'Aceitar Encontro' (com disparo de confetes) e 'Recusar';
- Atualização dinâmica do status do convite.
```

---

## ✅ 4. Checklist de Revisão de Código (*Code Review* da Dupla)

Antes de aprovar cada entrega do assistente de IA, a dupla verificou rigorosamente os seguintes critérios humanos:
- [x] **Adequação de Domínio:** Todas as telas conectam o conceito de relacionamentos à gastronomia (não é apenas um chat comum nem apenas um delivery comum, é um orquestrador de encontros).
- [x] **Compatibilidade de Versões:** Execução confirmada no Node.js `v24.22.0`, React `19.x` e Vite `8.x`.
- [x] **Resiliência e Ausência de Telas Brancas:** Caso o PostgreSQL Docker não esteja ligado durante uma apresentação, o frontend entra em modo fallback com dados mockados em `mockData.js`.
- [x] **Responsividade Mobile-First:** Funciona perfeitamente em telas verticais de smartphones e oferece o botão de *Moldura de Celular* para demonstração em monitores de alta resolução.
- [x] **Semântica e Segurança REST:** Variáveis sensíveis e credenciais de banco isoladas no `.env` e nunca expostas no código cliente.
- [x] **Acessibilidade e Contraste:** Cores validadas para legibilidade em modo claro e escuro.
