// ============================================================
// ÚNICO ARQUIVO QUE VOCÊ EDITA. O resto (HTML/CSS/app.js) não precisa mexer.
// ============================================================
window.CONFIG = {
  // Newsletter: grava no seu Supabase (projeto mypan2, tabela mypan.mybusiness_subscribers).
  // A chave abaixo é a PUBLICÁVEL (feita pra ficar no site). NUNCA coloque aqui
  // a chave secreta nem a de administrador do Supabase: o check.sh bloqueia.
  SUPABASE_URL: "https://csozsmftrmaqpygoarsl.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_EegEGqEJlc8SyoBLH7FJxA_SdJ3EpWM",

  INSTAGRAM_URL: "https://instagram.com/mybusiness.news",

  // Responsável pelos dados (aparece na página de privacidade — é PÚBLICO).
  // Email vazio = check.sh bloqueia o deploy.
  CONTACT_NAME: "Luis Arthur Bertho",
  CONTACT_EMAIL: "contato@mypan.com.br",

  // false = esconde a vitrine (enquanto os produtos abaixo são só exemplos).
  SHOW_SHOWCASE: false,

  CATEGORIES: [
    { id: "skills", label: "Skills de IA" },
    { id: "cursos", label: "Mini-cursos" },
  ],

  // Produtos. Regras:
  // - Sem checkoutUrl  -> mostra "Em breve" + "Me avise" (assina a newsletter
  //                       e grava o id do produto em "interesses").
  // - Com checkoutUrl  -> mostra preço + botão "Comprar" (Stripe Payment Link).
  // - NUNCA coloque aqui link direto do arquivo pago (Drive, .zip):
  //   o arquivo é entregue depois do pagamento, nunca pelo site.
  // - cover: imagem opcional (ex.: "img/x.webp"). Sem ela, a capa usa as cores da marca.
  // - priceNote: linha opcional abaixo do preço (ex.: extras cobrados no checkout).
  //   O preço aparece mesmo em "Em breve", pra quem chega saber quanto custa.
  //
  // ATENÇÃO: "animacao-reels" é o produto REAL em preparo (falta a skill revisada
  // e o Payment Link do Stripe). Os 3 itens depois dele são EXEMPLOS: apagar antes
  // de ligar SHOW_SHOWCASE.
  PRODUCTS: [
    {
      id: "animacao-reels",
      category: "skills",
      title: "Animação pra Reels e Stories",
      // RASCUNHO: confirmar a promessa depois de ler a skill (ela entrega vídeo pronto?).
      desc: "Você descreve o que quer mostrar e a IA monta a animação no formato vertical, pronta pra postar. Sem programa de edição.",
      fit: "quem posta pro próprio negócio e não tem tempo nem editor de vídeo",
      prompt: "Faz uma animação de 10s pro Reels mostrando <produto> com o preço <valor>",
      format: "1 tipo de animação à escolha · usa no Claude (claude.ai)",
      price: "R$ 27,90",
      priceNote: "+ R$ 7,90 por tipo extra, escolhido no pagamento",
      checkoutUrl: "",
      cover: "",
    },
    {
      id: "resumir-reunioes",
      category: "skills",
      title: "Resumo de reunião em 1 minuto",
      desc: "Cola a transcrição ou o áudio transcrito e recebe decisões, responsáveis e próximos passos, prontos pra mandar no WhatsApp.",
      fit: "donos e gestores que saem de reunião sem saber quem ficou com o quê",
      prompt: "Resume essa reunião em decisões, responsáveis e prazos: <cole a transcrição>",
      format: "",
      price: "",
      checkoutUrl: "",
      cover: "",
    },
    {
      id: "roteiros-posts",
      category: "skills",
      title: "Roteiro e post a partir de um tema",
      desc: "Do tema solto ao roteiro de Reels e à legenda, no tom da sua marca. Acaba a tela em branco.",
      fit: "quem posta pro próprio negócio e trava na hora de escrever",
      prompt: "Faz um roteiro de Reels de 30s e a legenda sobre <tema>, no tom da minha marca",
      format: "",
      price: "",
      checkoutUrl: "",
      cover: "",
    },
    {
      id: "ia-negocio-30min",
      category: "cursos",
      title: "IA pro seu negócio em 30 minutos",
      desc: "O básico que funciona: o que pedir, como pedir e onde a IA economiza horas na sua semana.",
      fit: "quem nunca usou IA no trabalho e quer começar certo",
      prompt: "",
      format: "4 aulas curtas · 30 min no total · assiste no celular",
      price: "",
      checkoutUrl: "",
      cover: "",
    },
  ],
};
