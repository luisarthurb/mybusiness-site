// Peças compartilhadas entre a home e o curso: formulário da newsletter e copiar texto.
// Fica num arquivo só pra o texto de consentimento (LGPD) nunca divergir entre páginas.
(function () {
  "use strict";
  var C = window.CONFIG;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Copia texto; devolve uma Promise que resolve quando terminou (com ou sem API moderna).
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    }
    fallbackCopy(text);
    return Promise.resolve();
  }
  function fallbackCopy(text) {
    var t = el("textarea"); t.value = text; t.setAttribute("readonly", "");
    t.className = "hp";
    document.body.append(t); t.select();
    try { document.execCommand("copy"); } catch (e) { /* sem suporte */ }
    t.remove();
  }

  // ---------- Formulário de inscrição (home, produtos e curso usam o mesmo) ----------
  // Grava no Supabase (mypan2) pela função subscribe_mybusiness_newsletter.
  // A chave publicável é pública por natureza; a tabela não pode ser lida pela API.
  function subscribeForm(o) {
    var form = el("form", "wait-form");
    form.noValidate = true;

    var label = el("label", "hp", "Seu email"); // visível só para leitores de tela
    label.htmlFor = o.id + "-email";

    var rowEl = el("div", "wait-row");
    var input = el("input");
    input.type = "email"; input.id = o.id + "-email"; input.name = "email";
    input.autocomplete = "email"; input.inputMode = "email"; input.required = true;
    input.placeholder = "seu@email.com";
    input.setAttribute("aria-describedby", o.id + "-msg");
    var btn = el("button", "btn btn-primary", o.button);
    btn.type = "submit";
    rowEl.append(input, btn);

    // Consentimento pelo clique: o texto fica junto do botão, sem caixa de marcar.
    var consentText = el("p", "consent",
      "Ao assinar, você aceita receber a newsletter semanal da mybusiness. Sai quando quiser, pelo link em todo email. ");
    var privacy = el("a", null, "Privacidade");
    privacy.href = "/privacidade";
    consentText.append(privacy);
    consentText.id = o.id + "-consent";
    btn.setAttribute("aria-describedby", consentText.id);

    // Campo isca: humanos não veem, robôs preenchem.
    var hp = el("input", "hp");
    hp.type = "text"; hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");

    var msg = el("p", "msg");
    msg.id = o.id + "-msg";
    msg.setAttribute("role", "status");

    form.append(label, rowEl, consentText, hp, msg);

    var say = function (t, isErr) { msg.textContent = t; msg.classList.toggle("err", !!isErr); };
    var success = function () {
      var done = el("p", "done", o.done);
      done.setAttribute("role", "status");
      form.replaceWith(done);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      say("");
      input.removeAttribute("aria-invalid");
      if (hp.value) { success(); return; }

      var email = input.value.trim();
      if (!EMAIL_RE.test(email)) {
        input.setAttribute("aria-invalid", "true");
        say("Confira o email: parece incompleto.", true);
        input.focus();
        return;
      }
      if (!C.SUPABASE_URL || !C.SUPABASE_PUBLISHABLE_KEY) {
        say("Página em configuração: o destino dos emails ainda não foi definido.", true);
        return;
      }

      var payload = { email: email, consent: true };
      if (o.interest) payload.interest = o.interest;

      btn.disabled = true;
      btn.textContent = "Enviando…";
      fetch(C.SUPABASE_URL + "/rest/v1/rpc/subscribe_mybusiness_newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": C.SUPABASE_PUBLISHABLE_KEY,
          "Content-Profile": "mypan"
        },
        body: JSON.stringify({ p_response: payload })
      }).then(function (res) {
        if (res.ok) { success(); return; }
        if (res.status === 400) {
          input.setAttribute("aria-invalid", "true");
          throw new Error("Confira o email e tente de novo.");
        }
        throw new Error("Não consegui enviar agora. Tenta de novo em instantes.");
      }).catch(function (err) {
        var text = err && err.message && err.message.indexOf("Confira") === 0
          ? err.message : "Não consegui enviar agora. Tenta de novo em instantes.";
        say(text, true);
        btn.disabled = false;
        btn.textContent = o.button;
      });
    });

    return form;
  }

  window.MB = { el: el, copyText: copyText, subscribeForm: subscribeForm };
})();
