// Acesso ao minicurso: email -> link de entrada (Supabase Auth, sem senha) -> conteúdo do banco.
// Só age com config.js > COURSE_AUTH.ENABLED = true. Projeto Supabase "mybusiness" (não o mypan2).
// Sem biblioteca: fala direto com a API do Supabase (Auth + REST), com a chave publicável.
(function () {
  "use strict";
  var C = window.CONFIG || {};
  var A = C.COURSE_AUTH || {};
  var MB = window.MB;
  if (!A.ENABLED || !MB) return;

  var $ = function (id) { return document.getElementById(id); };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var KEY = "mb-curso-sessao-v1";     // sessão (tokens) neste aparelho
  var NEWS = "mb-curso-news-v1";      // escolha da newsletter feita no envio do link
  var NEWS_OK = "mb-curso-news-ok-v1"; // emails já inscritos a partir daqui

  function get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function put(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } }
  function headers(token) {
    var h = { "apikey": A.PUBLISHABLE_KEY, "Content-Type": "application/json" };
    if (token) h.Authorization = "Bearer " + token;
    return h;
  }
  function now() { return Math.floor(Date.now() / 1000); }

  // ---------- Volta do link de entrada: #access_token=...&refresh_token=...&expires_in=... ----------
  function fromLink() {
    if (!location.hash || location.hash.indexOf("=") < 0) return null;
    var p = new URLSearchParams(location.hash.slice(1));
    var out = null;
    if (p.get("error") || p.get("error_description")) out = { error: true };
    else if (p.get("access_token") && p.get("refresh_token")) {
      out = { access_token: p.get("access_token"), refresh_token: p.get("refresh_token"), expires_at: now() + Number(p.get("expires_in") || 3600) };
    }
    if (out) history.replaceState(null, "", location.pathname + location.search); // tira o token da barra de endereço
    return out;
  }

  function refresh(s) {
    return fetch(A.SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST", headers: headers(), body: JSON.stringify({ refresh_token: s.refresh_token }),
    }).then(function (r) {
      if (!r.ok) throw new Error("sessao");
      return r.json();
    }).then(function (j) {
      return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || now() + (j.expires_in || 3600) };
    });
  }
  function validSession(s) {
    if (!s || !s.access_token) return Promise.resolve(null);
    if (s.expires_at - 60 > now()) return Promise.resolve(s);
    return refresh(s).then(function (n) { put(KEY, n); return n; }, function () { put(KEY, null); return null; });
  }
  function getUser(s) {
    return fetch(A.SUPABASE_URL + "/auth/v1/user", { headers: headers(s.access_token) })
      .then(function (r) { if (!r.ok) throw new Error("usuario"); return r.json(); });
  }
  function getContent(s) {
    var url = A.SUPABASE_URL + "/rest/v1/course_content?course=eq." + encodeURIComponent(A.COURSE || "skills") + "&select=payload";
    return fetch(url, { headers: headers(s.access_token) })
      .then(function (r) { if (!r.ok) throw new Error("conteudo"); return r.json(); })
      .then(function (rows) { if (!rows.length || !rows[0].payload) throw new Error("vazio"); return rows[0].payload; });
  }
  function sendLink(email, news) {
    var url = A.SUPABASE_URL + "/auth/v1/otp?redirect_to=" + encodeURIComponent(location.origin + location.pathname);
    return fetch(url, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ email: email, create_user: true, data: { newsletter: !!news } }),
    }).then(function (r) {
      if (r.status === 429) throw new Error("Muitos pedidos seguidos. Espere 1 minuto e tente de novo.");
      if (!r.ok) throw new Error("Não consegui mandar o link agora. Tente de novo em instantes.");
    });
  }

  // Newsletter só pra quem escolheu o botão "Entrar e receber a newsletter".
  function maybeSubscribe(u) {
    var email = (u.email || "").toLowerCase();
    if (!email) return;
    var ok = get(NEWS_OK) || [];
    if (ok.indexOf(email) >= 0) return;
    var pend = get(NEWS);
    var wants = (u.user_metadata && u.user_metadata.newsletter === true) || (pend && pend.email === email && pend.news === true);
    if (!wants) return;
    MB.subscribe({ email: email, consent: true, interest: "curso-skills" }).then(function (r) {
      if (r.ok) { ok.push(email); put(NEWS_OK, ok); put(NEWS, null); }
    }, function () { /* tenta de novo no próximo acesso */ });
  }

  // ---------- Telas ----------
  function showGate(msg) {
    document.body.classList.add("is-gated");
    $("gate").hidden = false;
    $("acct").hidden = true;
    var list = $("gate-list");
    if (list && !list.children.length && window.CURSO) {
      window.CURSO.AULAS.forEach(function (a) {
        var li = MB.el("li");
        li.append(MB.el("span", "gl-n", "Aula " + a.n), MB.el("span", "gl-t", a.titulo), MB.el("span", "gl-m", a.min + " min"));
        list.append(li);
      });
    }
    if (msg) say(msg, true);
  }
  function showCourse(u) {
    document.body.classList.remove("is-gated");
    $("gate").hidden = true;
    $("acct-email").textContent = u.email || "";
    $("acct").hidden = false;
  }
  function say(t, isErr) {
    var m = $("gate-msg");
    m.textContent = t || "";
    m.classList.toggle("err", !!isErr);
  }

  // ---------- Formulário ----------
  var wantsNews = true;
  document.querySelectorAll("#gate-form [type=submit]").forEach(function (b) {
    b.addEventListener("click", function () { wantsNews = b.getAttribute("data-news") === "1"; });
  });
  $("gate-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("gate-email");
    var email = input.value.trim().toLowerCase();
    input.removeAttribute("aria-invalid");
    say("");
    if (!EMAIL_RE.test(email)) {
      input.setAttribute("aria-invalid", "true");
      say("Confira o email: parece incompleto.", true);
      input.focus();
      return;
    }
    var btns = document.querySelectorAll("#gate-form button");
    btns.forEach(function (b) { b.disabled = true; });
    put(NEWS, { email: email, news: wantsNews });
    sendLink(email, wantsNews).then(function () {
      $("gate-form").hidden = true;
      $("gate-sent-email").textContent = email;
      $("gate-sent").hidden = false;
      $("gate-sent").focus();
    }, function (err) {
      say(err.message, true);
    }).then(function () { btns.forEach(function (b) { b.disabled = false; }); });
  });
  $("gate-again").addEventListener("click", function () {
    $("gate-sent").hidden = true;
    $("gate-form").hidden = false;
    $("gate-email").focus();
  });
  $("logout").addEventListener("click", function () {
    var s = get(KEY);
    put(KEY, null);
    var done = function () { location.reload(); };
    if (s && s.access_token) {
      fetch(A.SUPABASE_URL + "/auth/v1/logout", { method: "POST", headers: headers(s.access_token) }).then(done, done);
    } else done();
  });

  // Link colado na mesma aba (só o # muda, a página não recarrega): recarrega pra ler o token.
  window.addEventListener("hashchange", function () {
    if (/access_token=|error_description=/.test(location.hash)) location.reload();
  });

  // ---------- Início ----------
  $("year").textContent = new Date().getFullYear();
  var back = fromLink();
  if (back && !back.error) put(KEY, back);
  validSession(get(KEY)).then(function (s) {
    if (!s) { showGate(back && back.error ? "Esse link expirou ou já foi usado. Peça um novo abaixo." : ""); return; }
    return getUser(s).then(function (u) {
      return getContent(s).then(function (data) {
        showCourse(u);
        maybeSubscribe(u);
        window.MBCurso.start(data);
      }, function () {
        // Logado, mas as aulas não vieram (rede, banco): mantém a sessão.
        showGate("Você está logado, mas não consegui carregar as aulas agora. Recarregue a página em instantes.");
      });
    }, function () {
      put(KEY, null);
      showGate("Sua sessão expirou. Entre de novo com seu email.");
    });
  });
})();
