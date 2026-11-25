# mybusiness-site — regras do projeto

Site estático (HTML/CSS/JS puro) da mybusiness: newsletter semanal + vitrine de skills de IA e mini-cursos.
Só a pasta `public/` vai pro ar. Deploy: Vercel ligada ao GitHub (push no main = produção);
o build da Vercel É o `scripts/check.sh` — se ele falhar, nada é publicado. Headers/CSP em `vercel.json`.

## Regras fixas
- Idioma: PT-BR. Tom direto, sem jargão.
- Produtos, preços, links, contato e endpoints moram SÓ em `public/config.js`. Não espalhar dados no HTML.
- `SHOW_SHOWCASE: false` enquanto os produtos forem exemplos. Só ligar com produto real.
- Novo domínio externo (fonte, script, API) exige atualizar a CSP em `vercel.json`, senão quebra em produção.
- NUNCA colocar no código do site link direto de arquivo pago (Google Drive, .zip, .pdf).
  Produto pago é entregue pelo checkout (Stripe), nunca pelo site.
- Nada de adrianobinhara.com: nem texto, nem imagem, nem logo. Ele é referência de estrutura, não fonte.
- Deploy em produção, compra de domínio e qualquer ação no Meta Ads exigem OK explícito do Luis.
- Rodar `bash scripts/check.sh` antes de qualquer deploy. Falhou = não sobe.
- Newsletter SEMANAL, lista própria no Supabase `mypan2` → `mypan.mybusiness_subscribers`
  (migração em `supabase/001_mybusiness_newsletter.sql`). O site só chama
  `subscribe_mybusiness_newsletter` / `unsubscribe_mybusiness_newsletter`. Nunca dar
  SELECT/INSERT direto pra anon. Nunca colocar sb_secret_/service_role no site.
- Antes da 1ª edição: escolher serviço de envio, autenticar domínio (SPF/DKIM),
  ligar confirmação por email (double opt-in). Link de saída de todo email: `/sair?t=<unsubscribe_token>`.

## Critérios de pronto (cada etapa)
1. Entende-se o que é / pra quem / quanto custa em 5s.
2. ≤ 2 cliques até checkout (ou até "Me avise" enquanto não há produto).
3. check.sh passa (sem link pago, sem material de terceiro).
4. Lighthouse mobile: performance ≥ 90, acessibilidade ≥ 95.
5. Sem scroll horizontal em 360 / 768 / 1280px.
6. LGPD: consentimento no formulário + `/privacidade` atualizada (versão = consent_version no banco).
