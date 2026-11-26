// ============================================================
// CONTEÚDO DO MINICURSO "SKILLS DE IA". Texto que o aluno lê mora SÓ aqui.
// O motor (curso.js) e as animações não precisam mudar pra trocar texto.
//
// Regra de precisão: todo fato sobre Claude/ChatGPT/Gemini/Copilot tem fonte
// oficial em FONTES e a data de verificação em VERIFICADO_EM. Mudou o produto?
// Reverifique e troque a data. Sem fonte = não entra.
// Marca: nomes só em texto, sem logo (Anthropic e OpenAI exigem permissão pra logo).
// ============================================================
window.CURSO = {
  VERIFICADO_EM: "26/11/2026",

  AULAS: [
    {
      n: 1,
      titulo: "O que é uma skill",
      min: 3,
      pronta: true,
      skill: "atendimento-whatsapp",
      cenas: [
        {
          titulo: "Sem skill, você repete tudo",
          texto: "Toda vez que pede uma resposta pra cliente, você explica de novo: o tom da loja, o horário, a entrega, a assinatura. Na conversa seguinte, a IA esqueceu tudo.",
        },
        {
          titulo: "Skill é a receita guardada",
          texto: "Uma skill é um arquivo de instruções que a IA guarda. Tem um nome, uma descrição de quando usar e o passo a passo. Você ensina uma vez.",
        },
        {
          titulo: "Você pede curto. Ela segue a receita.",
          texto: "Com a skill ligada, basta dizer “responde esse cliente”. A IA reconhece o pedido, abre a skill e responde do jeito da sua loja, sem você repetir nada.",
        },
        {
          titulo: "Ela lê só a etiqueta",
          texto: "Você pode ter dezenas de skills. A IA lê só o nome e a descrição de cada uma e abre a skill inteira quando o pedido combina. Por isso a descrição é a parte mais importante.",
        },
        {
          titulo: "Skill, conector, plugin: qual é qual",
          texto: "O pedido vale pra uma conversa. A skill é a receita que fica. O conector dá acesso a um app seu, como Gmail ou Agenda. O plugin é o pacote: junta skills e conectores e instala tudo de uma vez.",
        },
        {
          titulo: "Onde funciona hoje",
          texto: "Skill virou padrão aberto: o mesmo arquivo funciona em vários assistentes. No Claude, todos os planos têm, inclusive o grátis. No ChatGPT, só Business, Enterprise e Edu; no Plus e no grátis, use um Projeto com as instruções.",
        },
      ],
    },
    { n: 2, titulo: "Crie sua primeira skill conversando", min: 4, pronta: false, cenas: [] },
    { n: 3, titulo: "Ligue, teste e ajuste", min: 3, pronta: false, cenas: [] },
    { n: 4, titulo: "Plugins e conectores: a IA nos seus apps", min: 4, pronta: false, cenas: [] },
    { n: 5, titulo: "Por baixo do capô (opcional)", min: 4, pronta: false, tecnica: true, cenas: [] },
  ],

  // Skills prontas pra copiar. Texto no formato aberto (SKILL.md): name em minúsculas
  // com hífen; description abaixo de 200 caracteres (limite do claude.ai).
  SKILLS: [
    {
      id: "atendimento-whatsapp",
      area: "Atendimento",
      titulo: "Resposta pra cliente no WhatsApp",
      desc: "Responde dúvida de cliente no tom da sua loja: curto, simpático, com horário, entrega e a assinatura certa.",
      bomPra: "lojas e serviços que respondem as mesmas perguntas o dia todo",
      comoPedir: "Responde esse cliente: <cole a mensagem>",
      texto: [
        "---",
        "name: atendimento-whatsapp",
        "description: Responde mensagens de clientes (WhatsApp, Instagram, email) no tom da loja, curto e com os dados certos. Use quando o usuário pedir pra responder um cliente.",
        "---",
        "",
        "# Atendimento no WhatsApp",
        "",
        "## Antes de usar pela primeira vez",
        "Se algum dado abaixo ainda estiver entre <>, pergunte ao usuário e atualize a skill.",
        "",
        "## Dados da loja",
        "- Nome: <nome da loja>",
        "- Horário: <ex.: seg a sáb, 9h às 18h>",
        "- Entrega: <bairros, taxa, prazo>",
        "- Assinatura: <ex.: Equipe Doce Lar>",
        "",
        "## Como responder",
        "1. No máximo 4 linhas. O cliente lê no celular.",
        "2. Tom simpático e direto. Sem gíria e sem \"prezado\".",
        "3. Responda primeiro a pergunta. Depois ofereça o próximo passo (reservar, pedir, ver cardápio).",
        "4. Não sabe a resposta (preço, estoque)? Não invente: diga que vai confirmar.",
        "5. Termine com a assinatura.",
        "",
        "## Exemplo",
        "Cliente: \"tem bolo sem glúten?\"",
        "Resposta: \"Oi! Temos sim: o de laranja sai sem glúten às sextas. Entregamos no bairro até as 18h. Quer que eu reserve um? — Equipe Doce Lar\"",
      ].join("\n"),
    },
    {
      id: "resumo-reuniao",
      area: "Rotina",
      titulo: "Resumo de reunião em decisões",
      desc: "Cola a transcrição ou as anotações e recebe decisões, quem faz o quê e o prazo, pronto pra mandar no grupo.",
      bomPra: "quem sai da reunião sem saber quem ficou com o quê",
      comoPedir: "Resume essa reunião: <cole a transcrição>",
      texto: [
        "---",
        "name: resumo-reuniao",
        "description: Transforma transcrição ou anotações de reunião em decisões, responsáveis e prazos. Use quando o usuário colar uma reunião e pedir resumo.",
        "---",
        "",
        "# Resumo de reunião",
        "",
        "## Formato da resposta",
        "*Decisões*: uma por linha.",
        "*Quem faz o quê*: \"Nome: tarefa (prazo)\". Prazo não foi dito? Escreva \"sem prazo\". Não invente.",
        "*Pendências*: o que ficou sem decisão.",
        "",
        "## Regras",
        "1. No máximo 12 linhas no total.",
        "2. Use os nomes como aparecem na transcrição.",
        "3. Sem opinião sobre a reunião.",
        "4. No fim, ofereça a versão pra WhatsApp (sem formatação).",
      ].join("\n"),
    },
    {
      id: "cobranca-gentil",
      area: "Financeiro",
      titulo: "Cobrança gentil de conta atrasada",
      desc: "Lembrete de pagamento educado e firme, que cobra sem constranger e sem queimar o cliente.",
      bomPra: "quem trava na hora de cobrar cliente conhecido",
      comoPedir: "Lembra o <nome> da conta de <mês>, <valor>",
      texto: [
        "---",
        "name: cobranca-gentil",
        "description: Escreve lembrete de pagamento atrasado, educado e firme, sem constranger o cliente. Use quando o usuário pedir pra cobrar ou lembrar um cliente de uma conta.",
        "---",
        "",
        "# Cobrança gentil",
        "",
        "## Tom",
        "Educado, firme e curto. O cliente é bem-vindo de volta; a conta precisa ser paga.",
        "",
        "## Estrutura",
        "1. Cumprimente pelo nome.",
        "2. O fato: valor, vencimento e o que foi comprado.",
        "3. Como pagar (Pix ou link). Não sabe? Pergunte ao usuário.",
        "4. Saída fácil: \"se já pagou, desconsidere\".",
        "",
        "## Nunca",
        "- Ameaçar, citar SPC/Serasa ou juros que não foram combinados.",
        "- Sugerir mais de um lembrete por semana.",
      ].join("\n"),
    },
  ],

  // Fontes oficiais (lidas em VERIFICADO_EM). Citação, não dado de negócio.
  FONTES: [
    { nome: "Claude: usar skills (planos, onde ligar)", url: "https://support.claude.com/en/articles/12512180-use-skills" },
    { nome: "Claude: criar skill conversando", url: "https://academy.claude.com/tutorials/how-to-create-a-skill-with-claude-through-conversation" },
    { nome: "ChatGPT: skills (planos, onde criar)", url: "https://help.openai.com/en/articles/20001066-skills-in-chatgpt" },
    { nome: "ChatGPT: aposentadoria dos GPTs personalizados", url: "https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq" },
    { nome: "ChatGPT: projetos", url: "https://help.openai.com/en/articles/10169521-projects-in-chatgpt" },
    { nome: "Padrão aberto Agent Skills", url: "https://agentskills.io/specification" },
    { nome: "Gemini: skills", url: "https://blog.google/products-and-platforms/products/gemini/automate-tasks-with-skills/" },
    { nome: "Microsoft 365 Copilot: skills em agentes", url: "https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agent-builder-add-skills" },
  ],
};
