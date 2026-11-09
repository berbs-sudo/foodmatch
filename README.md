# 🍕 FoodMatch: Encontros com Sabor (Tinder + iFood) — MVP Acadêmico

![NodeJS](https://img.shields.io/badge/Node.js-22.x%20%7C%2024.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%20%7C%2016-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Projeto desenvolvido para a disciplina de **Laboratório de Programação** do curso de **Ciência da Computação — Centro Universitário UNIFACVEST**, sob orientação do **Prof. Willen Leolatto Carneiro**.

---

## 👥 Autores (Dupla)
* **Bernardo Luciano Luiz Rodrigues** **&** **Debora De Souza**

---

## 📌 Sobre o Projeto
O **FoodMatch** é uma aplicação web responsiva (mobile-first) inovadora que funde a dinâmica de encontros e descoberta interpessoal (estilo *Tinder*) com a curadoria e catálogo gastronômico de restaurantes e menus (estilo *iFood*). 

O propósito central da plataforma é superar o clássico dilema dos encontros modernos (*"Para onde vamos?"* / *"O que você quer comer?"*), conectando pessoas a partir de suas **afinidades de paladar e culinárias favoritas**. Ao darem "Match", os usuários podem abrir o catálogo integrado de restaurantes parceiros, escolher um local e enviar um **Convite Interativo de Encontro** com data e hora diretamente no chat da conversa.

O desenvolvimento seguiu rigorosamente as práticas modernas de **Engenharia de Software Assistida por IA**, priorizando arquitetura limpa, separação de responsabilidades (SoC), containerização, tipagem de banco relacional e revisão crítica de código (*Code Review*).

🔗 **Documentação Obrigatória de IA:** Acesse o arquivo [DOCUMENTACAO_IA.md](./DOCUMENTACAO_IA.md) para visualizar todos os prompts utilizados, iterações e decisões de engenharia.  
🏗️ **Documentação de Arquitetura:** Acesse o arquivo [docs/arquitetura.md](./docs/arquitetura.md) para a modelagem relacional, diagrama Mermaid e fluxo de dados.

---

## 🌟 Principais Funcionalidades

1. **Autenticação e Perfil Gastronômico:** Cadastro e perfil com fotos, biografia, cidade, prato favorito, restaurante queridinho e seleção de tags gastronômicas (Italiana, Japonesa, Vegana, Hambúrguer, Mexicana, Churrasco, Cafés).
2. **Feed de Descoberta (Swipe Cards):** Interface fluida estilo cartões com foto, idade, distância, badge de afinidade (% de compatibilidade gastronômica) e pratos favoritos. Ações de Like (coração), Descarte (X) e Super Like (estrela).
3. **Modal Comemorativo de Match:** Feedback instantâneo com animação de confetes, exibição lado a lado dos perfis e atalho direto para convidar para um restaurante.
4. **Módulo de Restaurantes (O "iFood"):** Catálogo filtrável por tipo de culinária, faixa de preço (`$` a `$$$$`), distância e avaliação por estrelas. Inclui visualização de cardápio com fotos e pratos em destaque ("TOP DATE").
5. **Chat em Tempo Real com Icebreakers:** Histórico de conversas, quebra-gelos culinários pré-definidos e respostas simuladas automáticas.
6. **Sistema de Agendamento Interativo:** Escolha de data e horário com envio de card interativo no chat. O convidado pode aceitar, recusar ou propor nova data com alteração reativa de status.
7. **Agenda de Encontros (Meus Dates):** Linha do tempo dos encontros agendados e confirmados.
8. **Dark Mode Nativo & Moldura Mobile:** Alternador de tema escuro persistente e modo moldura de smartphone para apresentações acadêmicas responsivas.

---

## 📂 Estrutura do Repositório

```text
meu-projeto/
├── docs/
│   ├── kanban-prints/       # Prints da evolução do quadro Kanban (GitHub Projects)
│   └── arquitetura.md       # Detalhamento da arquitetura e modelo de dados
├── frontend/                # Frontend SPA em React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/      # SwipeCard, RestaurantCatalog, ChatView, ScheduleModal, etc.
│   │   ├── mockData.js      # Dados mockados realistas e resiliência offline
│   │   ├── App.jsx          # Orquestrador de estado e fluxo de telas
│   │   └── main.jsx         # Ponto de entrada React
│   ├── tailwind.config.js   # Paleta romântica apetitosa e suporte a Dark Mode
│   └── package.json
├── prisma/
│   └── schema.prisma        # Modelagem relacional completa (Usuários, Restaurantes, Matches, Convites)
├── src/
│   ├── controllers/         # Regras de negócio da API (Auth, Feed, Restaurantes, Chat, Convites)
│   ├── database/            # Instância Singleton do Prisma ORM e dados de seed
│   ├── routes/              # Mapeamento RESTful de endpoints
│   └── server.js            # Ponto de entrada do servidor Node.js + Express
├── .env.example             # Modelo seguro de variáveis de ambiente
├── .gitignore               # Arquivos ignorados pelo controle de versão
├── docker-compose.yml       # Orquestração do banco PostgreSQL 16
├── DOCUMENTACAO_IA.md       # Matriz analítica de uso de Inteligência Artificial
├── package.json             # Dependências globais e scripts de execução
└── README.md                # Guia geral do projeto
```

---

## ⚙️ Pré-requisitos e Controle de Versões
Para garantir a execução local sem conflitos de ambiente, certifique-se de possuir instalado:
* **Node.js:** Versão mínima `22.x` e máxima `24.x` (LTS)
* **Docker & Docker Compose:** Ativos na máquina local (para execução com container de banco de dados)
* **PostgreSQL (via Container):** Versão `15` ou `16`

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o repositório e instalar dependências
```bash
git clone https://github.com/SEU-USUARIO/foodmatch.git
cd foodmatch
npm install
```

### 2. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto copiando o modelo `.env.example`:
```env
POSTGRES_USER=foodmatch_admin
POSTGRES_PASSWORD=foodmatch_secret_2026
POSTGRES_DB=foodmatch_db
DATABASE_URL="postgresql://foodmatch_admin:foodmatch_secret_2026@localhost:5432/foodmatch_db?schema=public"
PORT=3001
NODE_ENV=development
```

### 3. Subir o Banco de Dados via Docker (Opcional se usar PostgreSQL)
```bash
docker compose up -d
```

### 4. Executar as Migrações do Prisma ORM
```bash
npx prisma migrate dev --name init
```

### 5. Iniciar a Aplicação (Full Stack)
Para rodar o backend Express e o frontend React simultaneamente:
```bash
npm start
```
> O servidor Full Stack estará disponível em `http://localhost:3001`.  
> Para desenvolvimento com Hot Reload do frontend, você também pode executar `npm run dev:client`.

---

## 📡 Endpoints Principais da API RESTful

| Método | Rota | Descrição | Status HTTP Esperados |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Autentica o usuário e retorna o token de sessão | `200`, `401`, `500` |
| `POST` | `/api/auth/register` | Cadastra novo usuário com foto, biografia e preferências | `201`, `400`, `500` |
| `GET` | `/api/profile/me` | Retorna os dados e preferências do usuário logado | `200`, `404`, `500` |
| `PUT` | `/api/profile/me` | Atualiza foto de perfil, galeria, bio, prato favorito e culinárias | `200`, `400`, `500` |
| `GET` | `/api/feed` | Retorna o feed de descoberta de usuários com afinidade | `200`, `500` |
| `POST` | `/api/feed/swipe` | Processa a ação de Like / Dislike / SuperLike e valida match | `200`, `400`, `500` |
| `GET` | `/api/restaurants` | Catálogo de restaurantes com filtros (culinária, preço, busca) | `200`, `500` |
| `GET` | `/api/restaurants/:id` | Detalhes do restaurante e cardápio completo | `200`, `404`, `500` |
| `GET` | `/api/matches` | Lista os matches ativos e última mensagem da conversa | `200`, `500` |
| `GET` | `/api/matches/:id/messages` | Histórico de mensagens e convites do chat | `200`, `500` |
| `POST` | `/api/messages` | Envia uma nova mensagem no chat do match | `201`, `400`, `500` |
| `GET` | `/api/invites` | Lista os convites de encontros do usuário | `200`, `500` |
| `POST` | `/api/invites` | Cria e envia um Convite Interativo de Encontro no chat | `201`, `400`, `500` |
| `PUT` | `/api/invites/:id/status` | Atualiza o status do convite (`ACCEPTED`, `REJECTED`, `RESCHEDULED`) | `200`, `400`, `404`, `500` |

---

## 🌿 Padrão de Fluxo Git e Commits Semânticos
Este projeto utiliza *Semantic Commits* para manter a rastreabilidade do histórico da dupla:
* `feat:` Nova funcionalidade implementada (ex: swipe engine, catálogo iFood, agendamento)
* `fix:` Correção de bug ou falha de integração
* `docs:` Atualização de arquivos de documentação (`.md`, arquitetura e prints do Kanban)
* `chore:` Configurações de ambiente, Docker, Prisma ou pacotes
* `style:` Ajustes de Tailwind CSS, paleta de cores ou Dark Mode
