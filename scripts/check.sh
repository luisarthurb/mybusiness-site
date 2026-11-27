#!/usr/bin/env bash
# Barreira antes do deploy (roda local e como build da Vercel). Falhou = não publica.
cd "$(dirname "$0")/.." || exit 1
# Varre TODAS as subpastas (cursos/, vendor/...). Antes só olhava o 1º nível e deixava passar.
FILES=$(find public -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.md' -o -name '*.json' \) | sort)
fail=0
check() { if grep -n -i -E "$1" $FILES; then echo "BLOQUEADO: $2"; fail=1; fi; }
check 'drive\.google\.com|dropbox\.com|\.zip["'"'"']|\.pdf["'"'"']' "link direto de arquivo no código público"
check 'adrianobinhara' "material de terceiro"
check 'sb_secret_|service_role|eyJhbGci' "chave secreta/JWT do Supabase no código público (use só sb_publishable_)"
if grep -q 'CONTACT_EMAIL: ""' public/config.js; then
  echo "BLOQUEADO: CONTACT_EMAIL vazio em public/config.js (a página de privacidade exige contato)"; fail=1
fi
[ $fail -eq 0 ] && echo "check.sh OK" || exit 1
