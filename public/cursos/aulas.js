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
    {
      n: 4,
      titulo: "Plugins e conectores: a IA nos seus apps",
      min: 4,
      pronta: true,
      telas: {
        a: { badge: "Conectores: todos os planos", shelf: "Customize › Connectors" },
        b: { badge: "Plus: diretório de plugins", shelf: "Plugins" },
      },
      cenas: [
        {
          titulo: "Sem conector, ela não vê seus apps",
          texto: "Por padrão, a IA só sabe o que você escreve na conversa. Agenda, email, planilhas: tudo fora do alcance dela.",
        },
        {
          titulo: "Conector: você entrega a chave de um app",
          texto: "No Claude: Customize › Connectors, clique no + e escolha o app (Google Agenda, Gmail, Drive), depois “Connect” e autorize. No ChatGPT: Plugins, na barra lateral › escolha › “Install plugin” › “Connect”.",
        },
        {
          titulo: "Agora ela consulta seus dados",
          texto: "Com o conector ligado, a IA busca a informação no app e responde. No Claude, dá pra ligar e desligar cada conector por conversa, no botão + do chat.",
        },
        {
          titulo: "Plugin: o pacote pronto",
          texto: "O plugin junta skills e conectores (no Claude, também comandos e agentes) e instala tudo de uma vez. No Claude: Customize › Plugins, nos planos pagos. No ChatGPT: Plugins, na barra lateral.",
        },
        {
          titulo: "Conecte com cuidado",
          texto: "Conecte só serviços de empresas confiáveis e leia o que está autorizando. Um email ou documento pode trazer instruções escondidas pra IA (o nome disso é prompt injection): antes de deixar ela enviar ou apagar algo, confira.",
        },
        {
          titulo: "Onde funciona hoje",
          texto: "O Claude grátis já usa os conectores do diretório e 1 conector próprio; plugins do diretório são dos planos pagos. No ChatGPT Plus, o diretório aparece, mas cada plugin depende do plano; servidor MCP próprio é só Business, Enterprise e Edu.",
        },
      ],
      extras: [
        {
          titulo: "Pedido pra testar o conector",
          sub: "Mande depois de conectar a sua agenda",
          texto: "Usando a minha agenda, me diga o que eu tenho amanhã e sugira um horário livre de 1 hora pra uma reunião.",
        },
        {
          titulo: "Checklist antes de conectar",
          sub: "4 perguntas, 30 segundos",
          texto: "Antes de conectar um app à IA:\n1. É de uma empresa confiável?\n2. O que estou autorizando: ver, enviar, editar ou apagar?\n3. Preciso disso ligado sempre, ou só hoje?\n4. Tem dado de cliente? Se tiver, a responsabilidade (LGPD) continua sendo minha.",
        },
      ],
    },
    {
      n: 5,
      titulo: "Por baixo do capô (opcional)",
      min: 4,
      pronta: true,
      tecnica: true,
      telas: {
        a: { badge: "Claude Code: /skills", shelf: "Customize › Skills" },
        b: { badge: "Codex: .agents/skills", shelf: "Plugins › Skills" },
      },
      cenas: [
        {
          titulo: "Uma skill é só uma pasta",
          texto: "Dentro dela: o SKILL.md (obrigatório) e, se quiser, pastas de apoio. references/ pra textos de consulta, scripts/ pra código que a IA roda, assets/ pra modelos e imagens.",
        },
        {
          titulo: "O cabeçalho decide tudo",
          texto: "Entre os dois --- ficam name e description. name: minúsculas, números e hífen, até 64 caracteres, igual ao nome da pasta. description: o que faz e quando usar; o padrão aceita até 1.024 caracteres, mas no claude.ai fique abaixo de 200.",
        },
        {
          titulo: "Ela lê em três camadas",
          texto: "Primeiro, nome e descrição de todas as skills (uns 100 tokens cada). Quando uma é ativada, o corpo do SKILL.md (o recomendado é menos de 5.000 tokens). Os arquivos extras, só quando precisa.",
        },
        {
          titulo: "Script: conta certa, sem chute",
          texto: "Pra cálculo, conversão ou planilha, ponha um script em scripts/. A IA roda o código em vez de estimar. Precisa da execução de código ligada.",
        },
        {
          titulo: "MCP: a tomada dos conectores",
          texto: "MCP é um padrão aberto pra ligar apps de IA a sistemas externos. Cada conector é um servidor MCP. O plugin junta skills e conectores num pacote só.",
        },
        {
          titulo: "No Claude Code e no Codex",
          texto: "No Claude Code, suas skills ficam em ~/.claude/skills/ e as do projeto em .claude/skills/; chame com /nome-da-skill. Plugin: /plugin install nome@marketplace. No Codex: .agents/skills/ e $nome. O arquivo é o mesmo.",
        },
      ],
      extras: [
        {
          titulo: "Esqueleto de SKILL.md",
          sub: "Copie, troque o que está entre <> e salve numa pasta com o mesmo nome",
          texto: "---\nname: <nome-da-skill>\ndescription: <O que ela faz>. Use quando o usuário pedir <situação>.\n---\n\n# <Nome da skill>\n\n## Quando usar\n<Em que situação essa skill entra.>\n\n## Passo a passo\n1. <Primeiro passo>\n2. <Segundo passo>\n\n## Formato da resposta\n<Tamanho, tom, estrutura.>\n\n## Nunca\n- <O que ela não pode fazer>",
        },
      ],
    },
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
    { nome: "Claude: conectores do diretório", url: "https://support.claude.com/en/articles/11176164-pre-built-integrations-using-remote-mcp" },
    { nome: "Claude: conectores próprios (planos e limite do grátis)", url: "https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp" },
    { nome: "Claude: plugins", url: "https://claude.com/docs/plugins/overview" },
    { nome: "ChatGPT: plugins", url: "https://help.openai.com/en/articles/20001256-plugins-in-chatgpt" },
    { nome: "ChatGPT: modo desenvolvedor e MCP (planos)", url: "https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt" },
    { nome: "Claude Code: skills (pastas e comandos)", url: "https://code.claude.com/docs/en/skills" },
    { nome: "Claude Code: plugins", url: "https://code.claude.com/docs/en/plugins" },
    { nome: "Codex: skills", url: "https://learn.chatgpt.com/docs/build-skills" },
    { nome: "MCP: o que é", url: "https://modelcontextprotocol.io/introduction" },
  ],
};
