#!/usr/bin/env bash
# Barreira antes do deploy. Sai com erro se achar algo proibido no código público.
cd "$(dirname "$0")/.." || exit 1
FILES="index.html styles.css app.js config.js"
fail=0
check() { if grep -n -i -E "$1" $FILES; then echo "BLOQUEADO: $2"; fail=1; fi; }
check 'drive\.google\.com|dropbox\.com|\.zip["'"'"']|\.pdf["'"'"']' "link direto de arquivo no código público"
check 'adrianobinhara' "material de terceiro"
check 'sb_secret_|service_role|eyJhbGci' "chave secreta/JWT do Supabase no código público (use só sb_publishable_)"
[ $fail -eq 0 ] && echo "check.sh OK" || exit 1
