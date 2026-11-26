#!/usr/bin/env bash
# Barreira antes do deploy (roda local e como build da Vercel). Falhou = não publica.
cd "$(dirname "$0")/.." || exit 1
FILES=$(ls public/*.html public/*.js public/*.css)
fail=0
check() { if grep -n -i -E "$1" $FILES; then echo "BLOQUEADO: $2"; fail=1; fi; }
check 'drive\.google\.com|dropbox\.com|\.zip["'"'"']|\.pdf["'"'"']' "link direto de arquivo no código público"
check 'adrianobinhara' "material de terceiro"
check 'sb_secret_|service_role|eyJhbGci' "chave secreta/JWT do Supabase no código público (use só sb_publishable_)"
check 'window\.BASES' "versão INTERNA do personalizador (skills pagas embutidas) no site: use a versão com entrega.js"
if grep -q 'CONTACT_EMAIL: ""' public/config.js; then
  echo "BLOQUEADO: CONTACT_EMAIL vazio em public/config.js (a página de privacidade exige contato)"; fail=1
fi
# Skill paga dentro do git = produto de graça pra qualquer um (o repo é público).
if git ls-files --error-unmatch skills >/dev/null 2>&1 || git ls-files | grep -q -E '(^|/)SKILL\.md$|\.skill$'; then
  echo "BLOQUEADO: skill paga rastreada no git (repo público). Tire com: git rm -r --cached skills"; fail=1
fi
[ $fail -eq 0 ] && echo "check.sh OK" || exit 1
