// Descadastro pelo link do email: sair?t=<token>. Chama unsubscribe_mybusiness_newsletter.
(function () {
  "use strict";
  var C = window.CONFIG || {};
  var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var token = new URLSearchParams(location.search).get("t") || "";
  var btn = document.getElementById("unsub-btn");
  var text = document.getElementById("unsub-text");
  var msg = document.getElementById("unsub-msg");

  // Tira o token da barra de endereço (não fica no histórico nem em print).
  if (token && history.replaceState) history.replaceState(null, "", location.pathname);

  if (!UUID_RE.test(token)) {
    text.textContent = "Esse link de saída está incompleto. Use o link do fim de qualquer email da newsletter.";
    btn.remove();
    return;
  }

  btn.addEventListener("click", function () {
    btn.disabled = true;
    btn.textContent = "Saindo…";
    msg.textContent = "";
    msg.classList.remove("err");
    fetch(C.SUPABASE_URL + "/rest/v1/rpc/unsubscribe_mybusiness_newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": C.SUPABASE_PUBLISHABLE_KEY,
        "Content-Profile": "mypan"
      },
      body: JSON.stringify({ p_token: token })
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      text.textContent = "Pronto, você saiu da lista. Não vai receber mais nenhum email da newsletter.";
      btn.remove();
    }).catch(function () {
      msg.textContent = "Não consegui confirmar agora. Tenta de novo em instantes.";
      msg.classList.add("err");
      btn.disabled = false;
      btn.textContent = "Confirmar saída";
    });
  });
})();
