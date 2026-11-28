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
      // Etiquetas das telas ilustrativas nesta aula (a = Claude, b = ChatGPT).
      telas: {
        a: { badge: "Skills: todos os planos", shelf: "Customize › Skills" },
        b: { badge: "Skills: Business, Enterprise, Edu", shelf: "Plugins › Skills" },
      },
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
    {
      n: 2,
      titulo: "Crie sua primeira skill conversando",
      min: 4,
      pronta: true,
      skill: "atendimento-whatsapp",
      telas: {
        a: { badge: "Funciona no plano grátis", shelf: "Customize › Skills" },
        b: { badge: "Plano Plus: via Projeto", shelf: "Projeto › Instruções" },
      },
      cenas: [
        {
          titulo: "Comece pedindo a entrevista",
          texto: "Não escreva a skill sozinho. Diga pra IA o que você repete toda semana e peça pra ela te entrevistar antes. No Claude, isso funciona até no plano grátis.",
        },
        {
          titulo: "Ela pergunta, você responde",
          texto: "Ela faz uma pergunta por vez: nome da loja, horário, entrega, como você assina, o que nunca dizer. Responda curto, do jeito que você fala com o cliente.",
        },
        {
          titulo: "No Claude, vira skill",
          texto: "No fim, o Claude escreve o arquivo da skill (SKILL.md) e mostra pra você. Confira os dados e salve. Depois ela aparece em Customize › Skills, pronta pra usar em qualquer conversa.",
        },
        {
          titulo: "No ChatGPT Plus, vira Projeto",
          texto: "No Plus e no grátis ainda não tem skill. Peça as instruções, clique em New project na barra lateral, depois no menu ••• › Project settings, e cole. Atenção: elas só valem dentro desse projeto.",
        },
        {
          titulo: "Teste com um caso real",
          texto: "Mande uma pergunta de cliente de verdade. No Claude, numa conversa nova. No ChatGPT, dentro do projeto. Se ela responder no seu tom e com os seus dados, funcionou.",
        },
        {
          titulo: "Não gostou? Corrija falando",
          texto: "Ficou longo ou formal? Diga o que mudar. Ela reescreve; você salva a versão nova da skill ou cola as instruções novas no projeto. Duas ou três rodadas de ajuste é normal.",
        },
      ],
      // Materiais extras (botão Copiar).
      extras: [
        {
          titulo: "Pedido pra criar a skill (Claude)",
          sub: "Troque o que está entre <> e mande numa conversa nova",
          texto: "Quero criar uma skill pra <tarefa que repito toda semana>. Antes de escrever, me faça perguntas, uma de cada vez, até entender como eu faço. Depois monte a skill e me mostre pra revisar.",
        },
        {
          titulo: "Pedido pras instruções do Projeto (ChatGPT Plus)",
          sub: "O resultado você cola em ••• › Project settings",
          texto: "Quero criar as instruções de um Projeto pra <tarefa que repito toda semana>. Antes de escrever, me faça perguntas, uma de cada vez, até entender como eu faço. Depois escreva as instruções prontas pra eu colar no projeto.",
        },
      ],
    },
    {
      n: 3,
      titulo: "Instale uma skill pronta",
      min: 3,
      pronta: true,
      skill: "atendimento-whatsapp",
      telas: {
        a: { badge: "Upload: qualquer plano", shelf: "Customize › Skills" },
        b: { badge: "Plus: sem upload de skill", shelf: "Plugins › Skills" },
      },
      cenas: [
        {
          titulo: "Antes: ligue a execução de código",
          texto: "Skill só roda com ela ligada. Settings › Capabilities › “Code execution and file creation” (em algumas contas aparece como “Create and edit files”). É uma vez só.",
        },
        {
          titulo: "O .zip certo tem a pasta dentro",
          texto: "Abra o .zip: dentro tem que estar a pasta da skill, e o SKILL.md dentro dela. Arquivo solto ou pasta dentro de pasta dá erro. O nome da pasta é o nome da skill.",
        },
        {
          titulo: "Suba em Customize › Skills",
          texto: "Clique no +, depois em “+ Create skill” e em “Upload a skill”. Escolha o .zip. A skill aparece na sua lista.",
        },
        {
          titulo: "Ligue e teste",
          texto: "A skill não liga sozinha: ative a chave dela na lista. Depois peça algo que combine com a descrição. Se a resposta seguir as regras da skill, funcionou.",
        },
        {
          titulo: "Não usou? Olhe a chave e a descrição",
          texto: "Confira se a chave está ligada. Depois, a descrição: ela tem que dizer quando usar, com as palavras do seu pedido. No teste, seja explícito: “usa a minha skill de atendimento pra responder isso”. Ajuda, mas não é garantia.",
        },
        {
          titulo: "E no ChatGPT?",
          texto: "Business, Enterprise e Edu: Plugins › Skills › Create › “Upload from your computer”. No Plus: dá pra colar o texto do SKILL.md num Projeto, mas os arquivos extras da skill (modelos, scripts) não funcionam lá.",
        },
      ],
      extras: [
        {
          titulo: "Pedido de teste explícito",
          sub: "Use quando a skill não disparar sozinha",
          texto: "Usa a minha skill <nome da skill> pra <tarefa>: <cole aqui o caso real>",
        },
      ],
      // Chamada no fim da aula. Com a vitrine ligada (config.js) vira link; senão, "Me avise".
      cta: {
        titulo: "Quer skills prontas pro seu negócio?",
        textoEmBreve: "As skills da mybusiness chegam em .zip: você instala do jeito que acabou de ver. Assine e saiba primeiro quando abrirem.",
        textoVitrine: "As skills da mybusiness chegam em .zip: você instala do jeito que acabou de ver.",
        botaoVitrine: "Ver as skills",
        interesse: "skills-pagas",
      },
    },
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
      zip: "/downloads/gratis/atendimento-whatsapp.zip", // pacote completo (SKILL.md + modelos/), grátis
      texto: [
        "---",
        "name: atendimento-whatsapp",
        "description: Responde clientes (WhatsApp, Instagram, email) no tom da loja, curto e com os dados certos, sem inventar preço. Use ao pedir pra responder, cobrar retorno ou acalmar um cliente.",
        "---",
        "",
        "# Atendimento no WhatsApp",
        "",
        "Você escreve respostas a clientes em nome da loja. O objetivo é resolver em poucas linhas, no tom da casa, sem prometer o que a loja não confirmou. Quem envia é o usuário: ele lê a sua resposta antes de colar.",
        "",
        "## Antes de usar pela primeira vez",
        "Abra `modelos/dados-da-loja.md`. Os campos marcados **(obrigatório)** precisam estar preenchidos: pergunte ao usuário os que ainda estiverem entre `< >` e use as respostas dali em diante. Os outros são opcionais. Se um campo opcional estiver vazio, trate o cliente por \"você\" e não use emoji.",
        "",
        "**Se a pasta `modelos/` não existir** (a skill foi criada só com este texto): pergunte ao usuário nome da loja, assinatura, horário, como pedir, entrega e formas de pagamento. Guarde as respostas numa seção \"Dados da loja\" no fim desta skill e siga só com esses dados.",
        "",
        "## Como responder",
        "1. **Curto: até 3 frases e a assinatura.** A mensagem precisa caber na tela do celular sem rolar (uns 300 caracteres).",
        "2. **Responda primeiro o que foi perguntado**, na ordem das perguntas do cliente. Depois ofereça o próximo passo: reservar, pedir, mandar o cardápio, agendar.",
        "3. **Tom simpático e direto.** Sem gíria, sem \"prezado\", sem frase de robô.",
        "4. **Não invente.** Preço, estoque, sabor, prazo e horário de retorno que não estão em `dados-da-loja.md` entram como `[confirmar: o que falta]`. Resposta errada custa mais que resposta lenta.",
        "5. **\"Hoje\", \"agora\", \"amanhã\":** só afirme se você souber o dia e a hora atuais e se eles batem com o horário e o último pedido do dia. Se não souber, use `[confirmar: ...]`.",
        "6. **Assinatura** na última linha, sozinha: `— <assinatura>`.",
        "",
        "## Quando passar para um humano",
        "Nesses casos, escreva só uma resposta de espera, que acolhe sem decidir nada, e avise o usuário com **[PRECISA DE VOCÊ]**:",
        "- desconto, brinde ou preço fora da tabela;",
        "- cancelamento, troca, reembolso ou cobrança indevida;",
        "- atraso além do prazo informado;",
        "- cliente bravo, reclamação pública ou ameaça de avaliação ruim;",
        "- promessa fora do padrão (entrega fora da área, horário especial, encomenda urgente).",
        "",
        "Os modelos estão em `modelos/respostas-dificeis.md`. Se a mensagem cair em mais de um caso (cliente bravo **e** atraso, por exemplo), combine os modelos numa resposta só. Sem esse arquivo: peça desculpa sem discutir quem tem razão, mostre que entendeu o problema, não decida nada e diga quando volta a responder (`[confirmar: horário do retorno]`).",
        "",
        "## Formato da sua saída",
        "Sempre nesta ordem:",
        "",
        "1. **A mensagem para o cliente.** Pronta para colar se não tiver nenhum `[confirmar: ...]`.",
        "2. **Uma linha \"Pra você:\"**, só se precisar. Ela traz as perguntas que faltam para trocar cada `[confirmar]` e, quando for o caso, o **[PRECISA DE VOCÊ]** com o motivo e o que você precisa saber.",
        "",
        "Se o usuário pedir mensagem para colar já, sem placeholders, troque cada `[confirmar: ...]` por \"vou confirmar e já te falo\".",
        "",
        "## Exemplo",
        "Cliente: \"tem bolo sem glúten? entrega no Farol?\"",
        "",
        "Oi! Temos sim: o de laranja sai sem glúten às sextas. Entregamos no Farol até as 18h, com taxa de R$ 8. Quer que eu reserve um pra sexta?",
        "— Equipe Doce Lar",
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
