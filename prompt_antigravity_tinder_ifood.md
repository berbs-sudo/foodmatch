# Prompt para Antigravity: FoodMatch (Tinder + iFood)

**Contexto e Objetivo**
Atue como um desenvolvedor Full Stack e especialista em UX/UI. Crie uma aplicação web responsiva (mobile-first) com design moderno que funde a mecânica de encontros e networking (estilo Tinder) com um catálogo de restaurantes e menus (estilo iFood). O objetivo do sistema é conectar pessoas através de afinidades gastronômicas e permitir que, ao darem "match", possam agendar um encontro presencial em um restaurante escolhido diretamente na plataforma.

## Telas e Fluxos da Aplicação

* **Autenticação e Perfil:** Tela de login e cadastro. No perfil, o usuário deve adicionar fotos, uma breve bio e selecionar suas preferências gastronômicas (ex: Italiana, Japonesa, Vegana, Hambúrguer).
* **Feed de Descoberta (Swipe):** Interface principal estilo cards para curtir ou rejeitar perfis. Os cards devem mostrar a foto do usuário, nome, idade, bio e os "pratos ou restaurantes favoritos" em destaque. Deve possuir animações fluidas de arrastar para os lados.
* **Tela de Matches e Chat:** Uma área listando os matches recentes e o histórico de conversas. O chat deve ser em tempo real e possuir um botão de "Convidar para sair".
* **Módulo de Restaurantes (O "iFood"):** Ao clicar em "Convidar para sair" dentro do chat, abre-se um catálogo de restaurantes com filtros (proximidade, tipo de comida, preço). Cada restaurante exibe fotos, cardápio resumido e avaliações.
* **Sistema de Agendamento:** O usuário seleciona um restaurante do catálogo e envia um "Convite de Encontro" no chat com data e horário. O outro usuário recebe um card interativo na conversa para "Aceitar", "Recusar" ou "Propor outro horário/local".

## Requisitos Técnicos e Visuais

* Utilize uma paleta de cores apetitosa e romântica (tons de vermelho vibrante, laranja e branco) com suporte nativo a Dark Mode.
* A interface deve utilizar componentes modernos (como Tailwind CSS ou Material UI) com botões arredondados, sombras suaves e tipografia sem serifa de alta legibilidade.
* Crie dados mockados (falsos) realistas para perfis de usuários e lista de restaurantes para que a visualização do protótipo seja completa.