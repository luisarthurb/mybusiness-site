// Motor do minicurso: abas, progresso (salvo no aparelho), player de cenas animadas.
// Animação usa Motion (local em /vendor, a CSP não aceita CDN).
// Conteúdo: login desligado -> cursos/aulas.js; login ligado -> acesso.js busca no banco
// e chama MBCurso.start(conteúdo) depois que a pessoa entra.
(function () {
  "use strict";
  var MB = window.MB;
  var M = window.Motion;
  var started = false;
  window.MBCurso = { start: start };
  var AUTH = (window.CONFIG || {}).COURSE_AUTH || {};
  if (!AUTH.ENABLED) start(window.CURSO);

  function start(D) {
  if (started || !D || !MB) return;
  started = true;

  var $ = function (id) { return document.getElementById(id); };
  var el = MB.el;
  var AULAS = D.AULAS;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || !M;

  // ---------- Progresso (localStorage pode falhar: aba anônima, bloqueio) ----------
  var KEY = "mb-curso-skills-v1";
  var store = { seen: [], scene: {} };
  try { var raw = JSON.parse(localStorage.getItem(KEY) || "null"); if (raw && Array.isArray(raw.seen)) store = { seen: raw.seen, scene: raw.scene || {} }; } catch (e) { /* sem armazenamento */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* ok */ } }
  var isSeen = function (n) { return store.seen.indexOf(n) >= 0; };
  function setSeen(n, v) {
    store.seen = store.seen.filter(function (x) { return x !== n; });
    if (v) store.seen.push(n);
    save();
  }

  var ready = AULAS.filter(function (a) { return a.pronta; });
  var state = { aula: ready[0].n, cena: 0 };
  var aulaBy = function (n) { return AULAS.find(function (a) { return a.n === n; }); };
  var nextAula = function () {
    var a = ready.find(function (x) { return !isSeen(x.n); });
    return a || ready[0];
  };

  function copyWithFeedback(btn, text) {
    var label = btn.textContent;
    MB.copyText(text).then(function () {
      btn.textContent = "Copiado ✓";
      setTimeout(function () { btn.textContent = label; }, 1800);
    });
  }

  // ---------- Abas ----------
  var TABS = ["aulas", "skills", "kit"];
  function selectTab(id, focus) {
    TABS.forEach(function (t) {
      var on = t === id;
      var b = $("tab-" + t);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      $("p-" + t).hidden = !on;
    });
    if (focus) $("tab-" + id).focus();
    if (id !== "aulas") stopScene(); else playScene();
  }
  TABS.forEach(function (t) {
    $("tab-" + t).addEventListener("click", function () {
      selectTab(t);
      history.replaceState(null, "", "#" + t);
    });
  });
  $("tabs").addEventListener("keydown", function (e) {
    var i = TABS.findIndex(function (t) { return $("tab-" + t) === document.activeElement; });
    if (i < 0) return;
    var j = null;
    if (e.key === "ArrowRight") j = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft") j = (i - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") j = 0;
    if (e.key === "End") j = TABS.length - 1;
    if (j == null) return;
    e.preventDefault();
    selectTab(TABS[j], true);
    history.replaceState(null, "", "#" + TABS[j]);
  });

  // ---------- Progresso (topo) ----------
  function renderProgress() {
    var dots = $("dots");
    dots.textContent = "";
    var nx = nextAula();
    AULAS.forEach(function (a) {
      var d = el("span", "dot");
      if (isSeen(a.n)) d.classList.add("is-seen");
      else if (a.n === nx.n) d.classList.add("is-next");
      dots.append(d);
    });
    var seen = store.seen.length;
    $("progress-count").textContent = seen + " de " + AULAS.length + " aulas vistas";
    var allReady = ready.every(function (a) { return isSeen(a.n); });
    $("continue").textContent = seen === 0 ? "Começar na Aula 1"
      : allReady ? "Rever a Aula " + ready[0].n
      : "Continuar na Aula " + nx.n;
  }
  $("continue").addEventListener("click", function () {
    selectTab("aulas");
    openAula(nextAula().n, true);
  });

  // Pictogramas das capas (SVG simples, sem imagem externa).
  var PICTS = {
    1: "M7 3h7l5 5v13H7z M14 3v5h5 M10 12h6 M10 15h6 M10 18h4",
    2: "M4 5h16v10H9l-5 4z M8 9h8 M8 12h5",
    3: "M3 9h18v6H3z M15 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M6 12h5",
    4: "M9 3v5 M15 3v5 M6 8h12v4a6 6 0 0 1-12 0z M12 18v3",
    5: "M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16",
  };
  function pictogram(n) {
    var NS = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "pict");
    s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.6"); s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(NS, "path"); p.setAttribute("d", PICTS[n] || PICTS[1]);
    s.append(p);
    return s;
  }

  // ---------- Cards das aulas ----------
  function renderAulaCards() {
    var g = $("aula-grid");
    g.textContent = "";
    AULAS.forEach(function (a) {
      var b = el("button", "aula-card");
      b.type = "button";
      if (!a.pronta) b.setAttribute("aria-disabled", "true");
      if (a.n === state.aula) b.setAttribute("aria-current", "true");
      var cov = el("span", "aula-cover" + (a.tecnica ? " is-tech" : ""));
      cov.setAttribute("aria-hidden", "true");
      cov.append(el("span", "num", String(a.n).padStart(2, "0")), pictogram(a.n));
      if (a.tecnica) cov.append(el("span", "tag", "Opcional"));
      var meta = el("span", "aula-meta");
      meta.append(el("span", null, "Aula " + a.n));
      if (!a.pronta) meta.append(el("span", "soon", "Em produção"));
      else if (isSeen(a.n)) meta.append(el("span", "seen", "Vista ✓"));
      else meta.append(el("span", null, a.min + " min"));
      b.append(cov, meta, el("span", "aula-name", a.titulo));
      if (a.pronta) b.addEventListener("click", function () { openAula(a.n, true); });
      g.append(b);
    });
    $("next-hint").hidden = store.seen.length === 0;
  }

  // ---------- Aula aberta ----------
  function openAula(n, scrollTo) {
    var a = aulaBy(n);
    if (!a || !a.pronta) return;
    state.aula = n;
    state.cena = Math.min(store.scene[n] || 0, a.cenas.length - 1);
    renderAulaCards();
    renderLesson();
    playScene();
    if (scrollTo) {
      $("player").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      $("player").focus({ preventScroll: true });
    }
  }

  function renderLesson() {
    var a = aulaBy(state.aula);
    $("lesson-title").textContent = "Aula " + a.n + ". " + a.titulo;
    $("lesson-meta").textContent = a.min + " min · " + a.cenas.length + " cenas";
    var mk = $("mark");
    mk.setAttribute("aria-pressed", String(isSeen(a.n)));
    mk.textContent = isSeen(a.n) ? "✓ Vista" : "✓ Marcar como vista";
    var i = ready.indexOf(a);
    $("prev-aula").disabled = i <= 0;
    $("next-aula").disabled = i >= ready.length - 1;

    var list = $("scene-list");
    list.textContent = "";
    a.cenas.forEach(function (c, k) {
      var li = el("li");
      var b = el("button", "scene-btn");
      b.type = "button";
      b.append(el("span", "sn", String(k + 1).padStart(2, "0")), el("span", "st", c.titulo));
      if (k === state.cena) b.setAttribute("aria-current", "true");
      b.addEventListener("click", function () { goScene(k, true); });
      li.append(b);
      list.append(li);
    });
    if (state.matAula !== a.n) { state.matAula = a.n; renderMaterials(a); }
  }

  function renderMaterials(a) {
    var ul = $("materials");
    ul.textContent = "";
    function item(icon, t, s, btnLabel, onClick) {
      var li = el("li", "mat");
      var ic = el("span", "mat-ico", icon);
      ic.setAttribute("aria-hidden", "true");
      var tx = el("div");
      tx.append(el("p", "mat-t", t), el("p", "mat-s", s));
      var b = el("button", "btn-out", btnLabel);
      b.type = "button";
      b.addEventListener("click", function () { onClick(b, li); });
      li.append(ic, tx, b);
      ul.append(li);
      return li;
    }
    item("¶", "Texto desta aula", "Cole na sua IA e peça pra ela te explicar com exemplos do seu negócio", "Copiar", function (b) {
      var txt = "Aula " + a.n + ". " + a.titulo + "\n\n" + a.cenas.map(function (c, k) {
        return (k + 1) + ". " + c.titulo + "\n" + c.texto;
      }).join("\n\n") + "\n\n(Minicurso Skills de IA · mybusiness · verificado em " + D.VERIFICADO_EM + ")";
      copyWithFeedback(b, txt);
    });
    (a.extras || []).forEach(function (x) {
      item("⧉", x.titulo, x.sub, "Copiar", function (b) { copyWithFeedback(b, x.texto); });
    });
    if (a.skill) {
      var sk = D.SKILLS.find(function (s) { return s.id === a.skill; });
      item("{ }", "A skill usada na aula", sk.titulo + ", pronta pra copiar", "Ver skill", function () {
        selectSkill(sk.id);
        selectTab("skills", true);
        history.replaceState(null, "", "#skills");
      });
    }
    var srcLi = item("↗", "Fontes oficiais", "Verificado em " + D.VERIFICADO_EM + ". Menus mudam: na dúvida, vale a fonte", "Ver fontes", function (b, li) {
      var ol = li.querySelector(".sources");
      ol.hidden = !ol.hidden;
      b.textContent = ol.hidden ? "Ver fontes" : "Fechar";
      b.setAttribute("aria-expanded", String(!ol.hidden));
    });
    var ol = el("ol", "sources");
    ol.hidden = true;
    ol.id = "sources-list";
    D.FONTES.forEach(function (f) {
      var li = el("li");
      var link = el("a", null, f.nome);
      link.href = f.url; link.rel = "noopener"; link.target = "_blank";
      li.append(link);
      ol.append(li);
    });
    srcLi.append(ol);
    var sb = srcLi.querySelector(".btn-out");
    sb.setAttribute("aria-expanded", "false");
    sb.setAttribute("aria-controls", "sources-list");
  }

  $("mark").addEventListener("click", function () {
    setSeen(state.aula, !isSeen(state.aula));
    renderLesson(); renderAulaCards(); renderProgress();
  });
  $("prev-aula").addEventListener("click", function () { var i = ready.indexOf(aulaBy(state.aula)); if (i > 0) openAula(ready[i - 1].n, true); });
  $("next-aula").addEventListener("click", function () { var i = ready.indexOf(aulaBy(state.aula)); if (i < ready.length - 1) openAula(ready[i + 1].n, true); });

  // ---------- Cenas ----------
  function goScene(k, fromList) {
    var a = aulaBy(state.aula);
    state.cena = Math.max(0, Math.min(k, a.cenas.length - 1));
    store.scene[a.n] = state.cena;
    if (state.cena === a.cenas.length - 1 && !isSeen(a.n)) {
      setSeen(a.n, true); renderAulaCards(); renderProgress();
    }
    save();
    renderLesson();
    playScene();
    if (fromList) {
      $("player").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      $("player").focus({ preventScroll: true });
    }
  }
  function renderCaption() {
    var a = aulaBy(state.aula);
    var c = a.cenas[state.cena];
    $("cap-count").textContent = "Cena " + (state.cena + 1) + " de " + a.cenas.length;
    $("cap-title").textContent = c.titulo;
    $("cap-text").textContent = c.texto;
    $("prev-scene").disabled = state.cena === 0;
    var last = state.cena === a.cenas.length - 1;
    var hasNext = ready.indexOf(a) < ready.length - 1;
    $("next-scene").textContent = !last ? "Próxima →" : hasNext ? "Próxima aula →" : "Ver as skills prontas →";
    renderCta(a, last);
  }
  // Chamada pras skills pagas no fim da aula (só aulas com "cta" em aulas.js).
  function renderCta(a, last) {
    var box = $("player-cta");
    if (!a.cta || !last) { box.hidden = true; return; }
    box.hidden = false;
    if (box.getAttribute("data-aula") === String(a.n)) return;
    box.setAttribute("data-aula", String(a.n));
    box.textContent = "";
    var C = window.CONFIG || {};
    var txt = el("div", "cta-text");
    txt.append(el("p", "cta-t", a.cta.titulo), el("p", "cta-s", C.SHOW_SHOWCASE ? a.cta.textoVitrine : a.cta.textoEmBreve));
    box.append(txt);
    if (C.SHOW_SHOWCASE) {
      var l = el("a", "btn btn-primary", a.cta.botaoVitrine);
      l.href = "/#vitrine";
      box.append(l);
    } else {
      var f = el("div", "cta-form");
      f.append(MB.subscribeForm({
        id: "f-cta-" + a.n,
        interest: a.cta.interesse,
        button: "Me avise",
        done: "Pronto. Você vai saber primeiro quando as skills abrirem.",
      }));
      box.append(f);
    }
  }
  // No celular o botão fica abaixo do palco: se o palco saiu de vista, volta até ele.
  function revealStage() {
    if ($("stage").getBoundingClientRect().top < 56) {
      $("player").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }
  $("prev-scene").addEventListener("click", function () { goScene(state.cena - 1); revealStage(); });
  $("next-scene").addEventListener("click", function () {
    var a = aulaBy(state.aula);
    if (state.cena < a.cenas.length - 1) { goScene(state.cena + 1); revealStage(); return; }
    var i = ready.indexOf(a);
    if (i < ready.length - 1) return openAula(ready[i + 1].n, true);
    selectSkill(a.skill || D.SKILLS[0].id);
    selectTab("skills", true);
    history.replaceState(null, "", "#skills");
  });
  $("replay").addEventListener("click", function () { playScene(); revealStage(); });

  // Troca de tela no celular (Claude | ChatGPT). No desktop as duas aparecem juntas.
  function showMock(k) {
    document.querySelectorAll(".ai-btn").forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-show") === k)); });
    $("screens").className = "screens show-" + k;
  }
  document.querySelectorAll(".ai-btn").forEach(function (b) {
    b.addEventListener("click", function () { showMock(b.getAttribute("data-show")); });
  });

  // ================= ANIMAÇÃO =================
  var mocks = Array.prototype.slice.call(document.querySelectorAll(".mock")).map(function (m) {
    return {
      root: m,
      chat: m.querySelector(".mock-chat"),
      typed: m.querySelector(".mock-typed"),
      shelf: m.querySelector(".mock-shelf"),
      list: m.querySelector(".shelf-list"),
      badge: m.querySelector(".mock-badge"),
      shelfTitle: m.querySelector(".shelf-title"),
    };
  });
  var board = $("board");
  var stampLayer = $("stamp-layer");
  var token = 0;
  var live = [];

  function track(a) { if (a) live.push(a); return a; }
  // Promessa de fim de animação; com movimento reduzido tudo vai direto pro estado final.
  function anim(target, kf, o) {
    if (!target || (target.length === 0)) return Promise.resolve();
    o = Object.assign({ duration: 0.45, ease: [0.22, 1, 0.36, 1] }, o || {});
    if (reduce) { o.duration = 0; o.delay = 0; delete o.type; }
    var a = track(M ? M.animate(target, kf, o) : null);
    if (!a) return Promise.resolve();
    return a.finished || a;
  }
  function stagger(s) { return reduce || !M ? 0 : M.stagger(s); }
  function wait(ms) { return reduce ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); }
  function typeInto(node, text, cps) {
    if (reduce || !M) { node.textContent = text; return Promise.resolve(); }
    return new Promise(function (res) {
      track(M.animate(0, text.length, {
        duration: text.length / (cps || 32), ease: "linear",
        onUpdate: function (v) { node.textContent = text.slice(0, Math.round(v)); },
        onComplete: res,
      }));
    });
  }
  function stopScene() {
    token++;
    live.forEach(function (a) { try { a.stop(); } catch (e) { /* já parou */ } });
    live = [];
  }
  function resetStage() {
    var tl = (aulaBy(state.aula) || {}).telas || {};
    mocks.forEach(function (m) {
      var cfg = tl[m.root.getAttribute("data-ai")] || {};
      if (cfg.badge) m.badge.textContent = cfg.badge;
      if (cfg.shelf) m.shelfTitle.textContent = cfg.shelf;
      m.root.style.opacity = "";
      m.root.querySelectorAll(".perm").forEach(function (x) { x.remove(); });
      m.chat.textContent = ""; m.typed.textContent = "";
      m.list.textContent = ""; m.shelf.classList.remove("is-open");
      m.shelf.style.opacity = ""; m.shelf.style.transform = "";
    });
    board.textContent = ""; board.classList.remove("is-on"); board.style.opacity = "";
    stampLayer.textContent = "";
    $("screens").style.opacity = "";
  }
  // Só anima quando o palco aparece na tela (senão a cena acaba antes do aluno chegar).
  var stageSeen = !("IntersectionObserver" in window);
  var pending = false;
  if (!stageSeen) {
    new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; }) && !stageSeen) {
        stageSeen = true;
        if (pending) playScene();
      }
    }, { threshold: 0.35 }).observe($("stage"));
  }
  function playScene() {
    stopScene();
    resetStage();
    renderCaption();
    if (!stageSeen) { pending = true; return; }
    pending = false;
    var fn = (SCENES[state.aula] || [])[state.cena];
    var t = token;
    if (fn) fn(function () { return t === token; });
  }

  // Peças de cena
  function bubble(m, who, text, day) {
    var b = el("div", who === "u" ? "msg-u" : "msg-a");
    if (day) b.append(el("span", "day", day));
    var tx = el("span", "msg-text", text);
    b.append(tx);
    b.style.opacity = "0";
    m.chat.append(b);
    return b;
  }
  function chip(m, text) { var c = el("div", "use-chip", text); c.style.opacity = "0"; m.chat.append(c); return c; }
  function shelfItem(m, name) { var li = el("li", "shelf-item", name); m.list.append(li); return li; }
  function openShelves(names, instant) {
    mocks.forEach(function (m) {
      m.shelf.classList.add("is-open");
      names.forEach(function (n) { shelfItem(m, n); });
    });
    if (instant) return Promise.resolve();
    return anim(mocks.map(function (m) { return m.shelf; }), { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
  }
  function showBoard() {
    board.classList.add("is-on");
    return anim(board, { opacity: [0, 1] }, { duration: 0.3 });
  }
  function stamp(text) {
    var s = el("div", "stamp", text);
    stampLayer.append(s);
    return anim(s, { opacity: [0, 1], scale: [1.5, 1], rotate: [-10, -4] }, { type: "spring", bounce: 0.45, duration: 0.6 });
  }
  function both(fn) { return Promise.all(mocks.map(fn)); }
  function fileChip(m, name) {
    var f = el("div", "file-chip");
    f.append(el("span", "fc-ico", "MD"), el("span", "fc-name", name), el("span", "fc-kind", "SKILL.md"));
    f.style.opacity = "0"; m.chat.append(f); return f;
  }
  function shelfNote(m, title, lines) {
    var li = el("li", "shelf-note");
    li.append(el("span", "sn-t", title));
    var spans = lines.map(function (t) { var x = el("span", "sn-l", t); x.style.opacity = "0"; li.append(x); return x; });
    m.list.append(li);
    return spans;
  }
  // Conversa curta: cada par [pergunta da IA, resposta do usuário] nas duas telas.
  async function exchange(ok, pairs) {
    for (var i = 0; i < pairs.length; i++) {
      var qs = mocks.map(function (m) { var b = bubble(m, "a", ""); b.style.opacity = "1"; return b; });
      await Promise.all(qs.map(function (b) { return typeInto(b.querySelector(".msg-text"), pairs[i][0], 55); }));
      if (!ok()) return false;
      await wait(250); if (!ok()) return false;
      var us = mocks.map(function (m) { return bubble(m, "u", pairs[i][1]); });
      await anim(us, { opacity: [0, 1], y: [10, 0] }, { duration: 0.3 });
      if (!ok()) return false;
      await wait(350); if (!ok()) return false;
    }
    return true;
  }
  function treeBox(kind, title, lines) {
    var t = el("div", "tree " + kind);
    t.append(el("p", "tree-h", title));
    var pre = el("pre", "tree-pre", lines.join("\n"));
    t.append(pre);
    t.style.opacity = "0";
    return t;
  }
  function shelfOpt(m, text, cls) { var li = el("li", "shelf-opt" + (cls ? " " + cls : ""), text); li.style.opacity = "0"; m.list.append(li); return li; }
  // Aula 4: linha de conector (nome + botão) e pedido de permissão dentro da tela
  function connRow(m, name, btn) {
    var li = el("li", "conn-row");
    li.append(el("span", "conn-name", name), el("span", "conn-btn", btn));
    m.list.append(li);
    return li;
  }
  function connect(li) { var b = li.querySelector(".conn-btn"); b.textContent = "Conectado"; b.classList.add("is-on"); }
  function permission(m, title, text, btn) {
    var box = el("div", "perm");
    box.append(el("p", "perm-t", title), el("p", "perm-s", text), el("span", "perm-btn", btn));
    box.style.opacity = "0";
    m.root.append(box);
    return box;
  }
  // Quadros: linhas que aparecem uma a uma
  function rowsIn(cls, items) {
    return items.map(function (it) {
      var r = el("div", cls);
      if (typeof it === "string") r.textContent = it;
      else it.forEach(function (part) { r.append(el("span", part[0], part[1])); });
      r.style.opacity = "0";
      return r;
    });
  }
  var mockA = function () { return mocks.find(function (m) { return m.root.getAttribute("data-ai") === "a"; }); };
  var mockB = function () { return mocks.find(function (m) { return m.root.getAttribute("data-ai") === "b"; }); };

  var SKILL_NAME = "atendimento-whatsapp";
  // Rótulos das telas nas Aulas 4 e 5 (conferidos nas fontes oficiais; ver aulas.js > FONTES).
  var CONN = {
    a: { lista: "Customize › Connectors", botao: "Connect" },
    b: { lista: "Plugins", botao: "Connect" },
    pacote: "Claude: Customize › Plugins (planos pagos) · ChatGPT: Plugins, na barra lateral",
    onde: [
      ["Claude grátis", "Conectores", "Conectores do diretório (Agenda, Gmail, Drive) + 1 conector próprio. Plugins do diretório: só nos pagos.", true],
      ["Claude pago", "Completo", "Conectores, conectores próprios e plugins.", false],
      ["ChatGPT Plus", "Diretório", "Vê o diretório de plugins; cada plugin depende do plano. Sem servidor MCP próprio.", true],
      ["ChatGPT Business, Enterprise, Edu", "Completo", "Plugins e servidor MCP próprio (só na web).", false],
    ],
  };
  var TECH = [
    ["Claude Code: onde ficam", "pastas", "~/.claude/skills/ (suas) · .claude/skills/ (do projeto)"],
    ["Claude Code: usar", "comando", "/nome-da-skill · /skills lista todas"],
    ["Claude Code: plugin", "comando", "/plugin install nome@marketplace"],
    ["Codex", "pasta", ".agents/skills/ · chame com $nome"],
  ];
  var LONG = "Responde esse cliente no tom da loja: simpático, sem gíria, fala do horário, oferece entrega e assina “Equipe Doce Lar”…";
  var ASK = "Responde: “tem bolo sem glúten?”";
  var ANSWER = "Oi! Temos sim: o de laranja sai sem glúten às sextas. Entregamos no bairro até as 18h. Quer que eu reserve um? — Equipe Doce Lar";

  var SCENES = {
    1: [
      // 1. Sem skill, você repete tudo
      async function (ok) {
        var days = ["seg", "qua", "sex"];
        for (var i = 0; i < days.length; i++) {
          var bs = mocks.map(function (m) { return bubble(m, "u", LONG, days[i]); });
          await anim(bs, { opacity: [0, 1], y: [14, 0] }, { duration: 0.45, delay: stagger(0.12) });
          if (!ok()) return;
          mocks.forEach(function (m) {
            var all = m.chat.querySelectorAll(".msg-u");
            for (var j = 0; j < all.length - 1; j++) anim(all[j], { opacity: 0.35 }, { duration: 0.3 });
          });
          await wait(500); if (!ok()) return;
        }
        await stamp("3× a mesma explicação");
      },

      // 2. Skill é a receita guardada
      async function (ok) {
        var card = el("div", "skillcard");
        var head = el("div", "sc-head");
        head.append(el("span", null, SKILL_NAME + "/"), el("span", null, "SKILL.md"));
        var body = el("div", "sc-body");
        [["name: ", SKILL_NAME], ["description: ", "use quando eu pedir pra responder cliente"], ["", "— instruções —", "sep"],
         ["1. ", "Tom simpático, sem gíria"], ["2. ", "Responde a pergunta e oferece entrega"], ["3. ", "Assina “Equipe Doce Lar”"]]
          .forEach(function (r) {
            var line = el("div", "sc-line" + (r[2] ? " " + r[2] : ""));
            if (r[0]) line.append(el("span", "k", r[0]));
            line.append(document.createTextNode(r[1]));
            line.style.opacity = "0";
            body.append(line);
          });
        card.append(head, body);
        board.append(card);
        await showBoard(); if (!ok()) return;
        await anim(card, { opacity: [0, 1], y: [24, 0], scale: [0.96, 1] }, { duration: 0.45 });
        await anim(Array.from(body.children), { opacity: [0, 1], x: [-10, 0] }, { duration: 0.35, delay: stagger(0.22) });
        if (!ok()) return;
        await wait(1400); if (!ok()) return;
        await anim(card, { scale: [1, 0.3], opacity: [1, 0], y: [0, -60] }, { duration: 0.55, ease: [0.6, 0, 0.4, 1] });
        if (!ok()) return;
        await anim(board, { opacity: [1, 0] }, { duration: 0.25 });
        board.classList.remove("is-on"); board.textContent = "";
        await openShelves([], false); if (!ok()) return;
        var items = mocks.map(function (m) { return shelfItem(m, SKILL_NAME); });
        await anim(items, { opacity: [0, 1], scale: [0.6, 1] }, { type: "spring", bounce: 0.5, duration: 0.6 });
      },

      // 3. Você pede curto. Ela segue a receita.
      async function (ok) {
        await openShelves([SKILL_NAME], true);
        await both(function (m, k) { return wait(k * 300).then(function () { return typeInto(m.typed, ASK, 30); }); });
        if (!ok()) return;
        await wait(300); if (!ok()) return;
        mocks.forEach(function (m) { m.typed.textContent = ""; });
        var us = mocks.map(function (m) { return bubble(m, "u", ASK); });
        await anim(us, { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
        if (!ok()) return;
        var chips = mocks.map(function (m) { return chip(m, "Usando a skill " + SKILL_NAME); });
        mocks.forEach(function (m) { m.list.firstChild.classList.add("is-on"); });
        await anim(chips, { opacity: [0, 1], scale: [0.85, 1] }, { type: "spring", bounce: 0.4, duration: 0.5 });
        if (!ok()) return;
        await wait(350); if (!ok()) return;
        var as = mocks.map(function (m) { var b = bubble(m, "a", ""); b.style.opacity = "1"; return b; });
        await Promise.all(as.map(function (b) { return typeInto(b.querySelector(".msg-text"), ANSWER, 48); }));
      },

      // 4. Ela lê só a etiqueta
      async function (ok) {
        var wrap = el("div", "labels");
        var req = el("p", "bd-req", "Pedido: “lembra o Sr. João da conta de março”");
        var grid = el("div", "label-grid");
        var data = [
          [SKILL_NAME, "Responde mensagem de cliente no tom da loja."],
          ["resumo-reuniao", "Transforma reunião em decisões e prazos."],
          ["post-instagram", "Cria legenda e roteiro no tom da marca."],
          ["cobranca-gentil", "Lembrete de pagamento educado e firme.", ["1. Cumprimenta pelo nome", "2. Valor, vencimento, o que foi", "3. Como pagar (Pix ou link)", "Nunca: ameaçar ou citar SPC"]],
        ];
        var lbls = data.map(function (d) {
          var l = el("div", "lbl");
          l.append(el("div", "lbl-name", d[0]), el("div", "lbl-desc", d[1]));
          if (d[2]) {
            var bd = el("div", "lbl-body"); bd.hidden = true;
            d[2].forEach(function (x) { var s = el("div", null, x); s.style.opacity = "0"; bd.append(s); });
            l.append(bd);
          }
          l.style.opacity = "0";
          grid.append(l);
          return l;
        });
        req.style.opacity = "0";
        wrap.append(req, grid);
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(req, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
        await anim(lbls, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35, delay: stagger(0.1) });
        if (!ok()) return;
        for (var i = 0; i < lbls.length; i++) {
          lbls[i].classList.add("is-scan");
          await wait(380); if (!ok()) return;
          if (i < lbls.length - 1) lbls[i].classList.remove("is-scan");
        }
        var hit = lbls[3];
        hit.classList.remove("is-scan"); hit.classList.add("is-match");
        anim(lbls.slice(0, 3), { opacity: 0.35 }, { duration: 0.3 });
        var body = hit.querySelector(".lbl-body");
        body.hidden = false;
        await anim(Array.from(body.children), { opacity: [0, 1], x: [-8, 0] }, { duration: 0.3, delay: stagger(0.15) });
      },

      // 5. Skill, conector, plugin: qual é qual
      async function (ok) {
        var wrap = el("div", "kinds");
        var data = [
          ["Pedido", "Vale pra uma conversa. Acabou, esqueceu."],
          ["Skill", "Receita guardada. A IA usa sozinha quando precisa."],
          ["Conector", "Dá acesso a um app seu: Gmail, Agenda, Drive."],
          ["Plugin", "Pacote pronto: instala tudo de uma vez."],
        ];
        var cards = data.map(function (d, i) {
          var c = el("div", "kind" + (i === 3 ? " is-plugin" : ""));
          c.append(el("div", "kind-k", d[0]), el("div", "kind-t", d[1]));
          c.style.opacity = "0";
          wrap.append(c);
          return c;
        });
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(cards, { opacity: [0, 1], y: [18, 0] }, { duration: 0.4, delay: stagger(0.35) });
        if (!ok()) return;
        await wait(600); if (!ok()) return;
        var pack = el("div", "kind-pack");
        var parts = ["skill", "skill", "conector"].map(function (p) { var s = el("span", null, p); s.style.opacity = "0"; pack.append(s); return s; });
        cards[3].append(pack);
        await anim(parts, { opacity: [0, 1], scale: [0.5, 1] }, { type: "spring", bounce: 0.5, duration: 0.5, delay: stagger(0.15) });
      },

      // 6. Onde funciona hoje
      async function (ok) {
        var wrap = el("div", "where");
        var h = el("p", "where-h", "Onde a skill funciona · " + D.VERIFICADO_EM);
        var rows = [
          ["Claude", "Sim", "Todos os planos, inclusive o grátis.", false],
          ["ChatGPT", "Parcial", "Só Business, Enterprise e Edu. Plus e grátis: use um Projeto.", true],
          ["Gemini", "Sim", "Skills substituíram os Gems.", false],
          ["Microsoft 365 Copilot", "Sim", "Skills dentro dos agentes.", false],
        ].map(function (r) {
          var row = el("div", "where-row");
          row.append(el("span", "where-name", r[0]), el("span", "where-pill" + (r[3] ? " part" : ""), r[1]), el("span", "where-note", r[2]));
          row.style.opacity = "0";
          return row;
        });
        var foot = el("p", "where-foot", "O mesmo arquivo de skill serve em todos");
        h.style.opacity = "0"; foot.style.opacity = "0";
        wrap.append(h);
        rows.forEach(function (r) { wrap.append(r); });
        wrap.append(foot);
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(h, { opacity: [0, 1] }, { duration: 0.3 });
        await anim(rows, { opacity: [0, 1], x: [-14, 0] }, { duration: 0.4, delay: stagger(0.22) });
        if (!ok()) return;
        await anim(foot, { opacity: [0, 1], y: [8, 0] }, { duration: 0.4 });
      },
    ],
    2: [
      // 1. Comece pedindo a entrevista
      async function (ok) {
        var asks = {
          a: "Quero criar uma skill pra responder cliente no WhatsApp. Me entrevista antes.",
          b: "Quero as instruções de um Projeto pra responder cliente. Me entrevista antes.",
        };
        await both(function (m, k) {
          return wait(k * 300).then(function () { return typeInto(m.typed, asks[m.root.getAttribute("data-ai")], 34); });
        });
        if (!ok()) return;
        await wait(300); if (!ok()) return;
        var us = mocks.map(function (m) { var t = m.typed.textContent; m.typed.textContent = ""; return bubble(m, "u", t); });
        await anim(us, { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
        if (!ok()) return;
        var rs = mocks.map(function (m) { var b = bubble(m, "a", ""); b.style.opacity = "1"; return b; });
        await Promise.all(rs.map(function (b) { return typeInto(b.querySelector(".msg-text"), "Combinado. Vou fazer uma pergunta por vez.", 45); }));
      },

      // 2. Ela pergunta, você responde
      async function (ok) {
        await exchange(ok, [
          ["Qual o nome da loja e o horário?", "Doce Lar, seg a sáb, 9h às 18h"],
          ["Como você assina as mensagens?", "Equipe Doce Lar"],
          ["Tem algo que eu nunca devo prometer?", "Entrega no mesmo dia"],
        ]);
      },

      // 3. No Claude, vira skill
      async function (ok) {
        showMock("a");
        var a = mockA(), b = mockB();
        var ra = bubble(a, "a", ""); ra.style.opacity = "1";
        var rb = bubble(b, "a", ""); rb.style.opacity = "1";
        await Promise.all([
          typeInto(ra.querySelector(".msg-text"), "Pronto. Montei a skill, revise antes de salvar:", 45),
          typeInto(rb.querySelector(".msg-text"), "Pronto. Aqui estão as instruções pra colar no seu Projeto:", 45),
        ]);
        if (!ok()) return;
        var fc = fileChip(a, SKILL_NAME);
        var blk = el("div", "msg-block", "Você responde clientes da Doce Lar. No máximo 4 linhas, tom simpático, assina “Equipe Doce Lar”. Nunca prometa entrega no mesmo dia…");
        blk.style.opacity = "0"; b.chat.append(blk);
        await anim([fc, blk], { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, delay: stagger(0.15) });
        if (!ok()) return;
        await wait(900); if (!ok()) return;
        // Claude: salvou, aparece na lista de skills
        a.shelf.classList.add("is-open");
        var it = shelfItem(a, SKILL_NAME);
        await anim(a.shelf, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
        await anim(it, { opacity: [0, 1], scale: [0.6, 1] }, { type: "spring", bounce: 0.5, duration: 0.6 });
        if (!ok()) return;
        await stamp("Skill salva no Claude");
      },

      // 4. No ChatGPT Plus, vira Projeto
      async function (ok) {
        showMock("b");
        var a = mockA(), b = mockB();
        a.shelf.classList.add("is-open"); shelfItem(a, SKILL_NAME);
        anim(a.root, { opacity: [1, 0.45] }, { duration: 0.3 });
        var blk = el("div", "msg-block", "Você responde clientes da Doce Lar. No máximo 4 linhas, tom simpático, assina “Equipe Doce Lar”. Nunca prometa entrega no mesmo dia…");
        b.chat.append(blk);
        await wait(300); if (!ok()) return;
        await anim(blk, { scale: [1, 1.03, 1], boxShadow: ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 3px rgba(26,26,26,.6)", "0 0 0 0 rgba(0,0,0,0)"] }, { duration: 0.8 });
        if (!ok()) return;
        b.shelf.classList.add("is-open");
        var lines = shelfNote(b, "Atendimento Doce Lar", ["Responde clientes da Doce Lar.", "Máx. 4 linhas, assina “Equipe Doce Lar”.", "Nunca prometer entrega no mesmo dia."]);
        await anim(b.shelf, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
        await anim(lines, { opacity: [0, 1], x: [-8, 0] }, { duration: 0.3, delay: stagger(0.3) });
        if (!ok()) return;
        await stamp("Só vale dentro do projeto");
      },

      // 5. Teste com um caso real
      async function (ok) {
        var a = mockA(), b = mockB();
        a.shelf.classList.add("is-open"); shelfItem(a, SKILL_NAME);
        b.shelf.classList.add("is-open");
        shelfNote(b, "Atendimento Doce Lar", ["Responde clientes da Doce Lar.", "Máx. 4 linhas, assina “Equipe Doce Lar”.", "Nunca prometer entrega no mesmo dia."])
          .forEach(function (x) { x.style.opacity = "1"; });
        var q = "Responde: “vocês entregam hoje?”";
        await both(function (m, k) { return wait(k * 250).then(function () { return typeInto(m.typed, q, 32); }); });
        if (!ok()) return;
        await wait(250); if (!ok()) return;
        mocks.forEach(function (m) { m.typed.textContent = ""; });
        await anim(mocks.map(function (m) { return bubble(m, "u", q); }), { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
        if (!ok()) return;
        var ca = chip(a, "Usando a skill " + SKILL_NAME);
        var cb = chip(b, "No projeto Atendimento Doce Lar");
        a.list.firstChild.classList.add("is-on");
        await anim([ca, cb], { opacity: [0, 1], scale: [0.85, 1] }, { type: "spring", bounce: 0.4, duration: 0.5 });
        if (!ok()) return;
        var ans = "Oi! Hoje não conseguimos, mas entregamos amanhã de manhã no seu bairro. Quer agendar? — Equipe Doce Lar";
        var rs = mocks.map(function (m) { var r = bubble(m, "a", ""); r.style.opacity = "1"; return r; });
        await Promise.all(rs.map(function (r) { return typeInto(r.querySelector(".msg-text"), ans, 48); }));
      },

      // 6. Não gostou? Corrija falando
      async function (ok) {
        var first = "Oi! Hoje não conseguimos, mas entregamos amanhã de manhã no seu bairro. Quer agendar? — Equipe Doce Lar";
        mocks.forEach(function (m) { bubble(m, "a", first).style.opacity = "0.4"; });
        var fix = "Ficou longo. Máximo 2 linhas e sem “Oi”.";
        await both(function (m, k) { return wait(k * 250).then(function () { return typeInto(m.typed, fix, 32); }); });
        if (!ok()) return;
        await wait(250); if (!ok()) return;
        mocks.forEach(function (m) { m.typed.textContent = ""; });
        await anim(mocks.map(function (m) { return bubble(m, "u", fix); }), { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
        if (!ok()) return;
        var short = "Hoje não dá. Entregamos amanhã cedo, agendo pra você? — Equipe Doce Lar";
        var rs = mocks.map(function (m) { var r = bubble(m, "a", ""); r.style.opacity = "1"; return r; });
        await Promise.all(rs.map(function (r) { return typeInto(r.querySelector(".msg-text"), short, 45); }));
        if (!ok()) return;
        await wait(500); if (!ok()) return;
        await stamp("Salve a versão nova");
      },
    ],
    3: [
      // 1. Antes: ligue a execução de código
      async function (ok) {
        showMock("a");
        var a = mockA(), b = mockB();
        anim(b.root, { opacity: [1, 0.4] }, { duration: 0.3 });
        a.shelfTitle.textContent = "Settings › Capabilities";
        a.shelf.classList.add("is-open");
        var it = shelfItem(a, "Code execution and file creation");
        it.classList.add("is-off");
        await anim(a.shelf, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
        if (!ok()) return;
        await wait(700); if (!ok()) return;
        it.classList.remove("is-off");
        await anim(it, { scale: [1, 1.06, 1] }, { duration: 0.45 });
        if (!ok()) return;
        await stamp("Uma vez só");
      },

      // 2. O .zip certo tem a pasta dentro
      async function (ok) {
        var wrap = el("div", "trees");
        var good = treeBox("ok", "✓ Certo", ["atendimento-whatsapp (.zip)", "└ atendimento-whatsapp/", "   ├ SKILL.md", "   └ modelos/"]);
        var bad1 = treeBox("bad", "✗ Arquivo solto", ["atendimento-whatsapp (.zip)", "└ SKILL.md"]);
        var bad2 = treeBox("bad", "✗ Pasta dentro de pasta", ["skill (.zip)", "└ skill/", "   └ atendimento-whatsapp/", "      └ SKILL.md"]);
        wrap.append(good, bad1, bad2);
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim([good, bad1, bad2], { opacity: [0, 1], y: [14, 0] }, { duration: 0.4, delay: stagger(0.3) });
        if (!ok()) return;
        await wait(500); if (!ok()) return;
        anim([bad1, bad2], { opacity: 0.45 }, { duration: 0.3 });
        await anim(good, { scale: [1, 1.04, 1] }, { duration: 0.5 });
      },

      // 3. Suba em Customize › Skills
      async function (ok) {
        showMock("a");
        var a = mockA(), b = mockB();
        anim(b.root, { opacity: [1, 0.4] }, { duration: 0.3 });
        a.shelf.classList.add("is-open");
        var plus = shelfOpt(a, "+", "shelf-plus");
        await anim(a.shelf, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
        await anim(plus, { opacity: [0, 1], scale: [0.6, 1] }, { type: "spring", bounce: 0.5, duration: 0.5 });
        if (!ok()) return;
        await wait(350); if (!ok()) return;
        var o1 = shelfOpt(a, "+ Create skill");
        await anim(o1, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.3 });
        await wait(450); if (!ok()) return;
        var o2 = shelfOpt(a, "Upload a skill", "is-hl");
        await anim(o2, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.3 });
        if (!ok()) return;
        await wait(600); if (!ok()) return;
        a.list.textContent = "";
        var zip = shelfOpt(a, "atendimento-whatsapp (.zip)", "shelf-zip");
        await anim(zip, { opacity: [0, 1], y: [-30, 0] }, { type: "spring", bounce: 0.35, duration: 0.6 });
        if (!ok()) return;
        await wait(600); if (!ok()) return;
        await anim(zip, { opacity: [1, 0] }, { duration: 0.25 });
        zip.remove();
        var it = shelfItem(a, SKILL_NAME);
        it.classList.add("is-off");
        await anim(it, { opacity: [0, 1], scale: [0.7, 1] }, { type: "spring", bounce: 0.45, duration: 0.55 });
        if (!ok()) return;
        await stamp("Na lista, ainda desligada");
      },

      // 4. Ligue e teste
      async function (ok) {
        showMock("a");
        var a = mockA(), b = mockB();
        anim(b.root, { opacity: [1, 0.4] }, { duration: 0.3 });
        a.shelf.classList.add("is-open");
        var it = shelfItem(a, SKILL_NAME);
        it.classList.add("is-off");
        await wait(500); if (!ok()) return;
        it.classList.remove("is-off");
        await anim(it, { scale: [1, 1.08, 1] }, { duration: 0.45 });
        if (!ok()) return;
        var q = "Responde esse cliente: “aceita Pix?”";
        await typeInto(a.typed, q, 32);
        if (!ok()) return;
        await wait(250); if (!ok()) return;
        a.typed.textContent = "";
        await anim(bubble(a, "u", q), { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
        if (!ok()) return;
        it.classList.add("is-on");
        await anim(chip(a, "Usando a skill " + SKILL_NAME), { opacity: [0, 1], scale: [0.85, 1] }, { type: "spring", bounce: 0.4, duration: 0.5 });
        if (!ok()) return;
        var r = bubble(a, "a", ""); r.style.opacity = "1";
        await typeInto(r.querySelector(".msg-text"), "Aceitamos sim! Pix na entrega ou antecipado, como preferir. Quer fazer o pedido? — Equipe Doce Lar", 48);
      },

      // 5. Não usou? Olhe a chave e a descrição
      async function (ok) {
        var wrap = el("div", "descs");
        function card(kind, head, code, note) {
          var c = el("div", "desc " + kind);
          c.append(el("p", "desc-h", head), el("p", "desc-code", code), el("p", "desc-note", note));
          c.style.opacity = "0"; wrap.append(c); return c;
        }
        var bad = card("bad", "✗ Vaga", "description: Ajuda com clientes.", "A IA não sabe quando usar.");
        var good = card("ok", "✓ Clara", "description: Responde mensagens de clientes (WhatsApp, Instagram) no tom da loja. Use quando o usuário pedir pra responder um cliente.", "Diz o quê e quando, com as palavras do pedido.");
        var tip = el("p", "bd-req", "No teste: “usa a minha skill de atendimento pra responder isso”");
        tip.style.opacity = "0"; wrap.append(tip);
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(bad, { opacity: [0, 1], y: [12, 0] }, { duration: 0.4 });
        await wait(700); if (!ok()) return;
        await anim(good, { opacity: [0, 1], y: [12, 0] }, { duration: 0.4 });
        anim(bad, { opacity: 0.5 }, { duration: 0.3 });
        if (!ok()) return;
        await wait(600); if (!ok()) return;
        await anim(tip, { opacity: [0, 1], y: [8, 0] }, { duration: 0.4 });
      },

      // 6. E no ChatGPT?
      async function (ok) {
        var wrap = el("div", "where");
        var h = el("p", "where-h", "Subir skill pronta · " + D.VERIFICADO_EM);
        var rows = [
          ["Claude", "Sobe a skill", "Qualquer plano, com a execução de código ligada.", false],
          ["ChatGPT Business, Enterprise, Edu", "Sobe a skill", "Plugins › Skills › Create › Upload from your computer.", false],
          ["ChatGPT Plus e grátis", "Só o texto", "Cole o SKILL.md num Projeto. Arquivos extras (modelos, scripts) não funcionam.", true],
        ].map(function (r) {
          var row = el("div", "where-row");
          row.append(el("span", "where-name", r[0]), el("span", "where-pill" + (r[3] ? " part" : ""), r[1]), el("span", "where-note", r[2]));
          row.style.opacity = "0";
          return row;
        });
        var foot = el("p", "where-foot", "Skill com arquivos extras? Use onde tem skill de verdade.");
        h.style.opacity = "0"; foot.style.opacity = "0";
        wrap.append(h); rows.forEach(function (r) { wrap.append(r); }); wrap.append(foot);
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(h, { opacity: [0, 1] }, { duration: 0.3 });
        await anim(rows, { opacity: [0, 1], x: [-14, 0] }, { duration: 0.4, delay: stagger(0.25) });
        if (!ok()) return;
        await anim(foot, { opacity: [0, 1], y: [8, 0] }, { duration: 0.4 });
      },
    ],
    4: [
      // 1. Sem conector, ela não vê seus apps
      async function (ok) {
        var q = "O que eu tenho na agenda amanhã?";
        await both(function (m, k) { return wait(k * 250).then(function () { return typeInto(m.typed, q, 32); }); });
        if (!ok()) return;
        await wait(250); if (!ok()) return;
        mocks.forEach(function (m) { m.typed.textContent = ""; });
        await anim(mocks.map(function (m) { return bubble(m, "u", q); }), { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
        if (!ok()) return;
        var rs = mocks.map(function (m) { var r = bubble(m, "a", ""); r.style.opacity = "1"; return r; });
        await Promise.all(rs.map(function (r) { return typeInto(r.querySelector(".msg-text"), "Não tenho acesso à sua agenda. Se você colar os compromissos aqui, eu organizo.", 45); }));
        if (!ok()) return;
        await stamp("Ela não vê seus apps");
      },

      // 2. Conector: você dá a chave de um app
      async function (ok) {
        var A = CONN.a, B = CONN.b;
        var rows = mocks.map(function (m) {
          var c = m.root.getAttribute("data-ai") === "a" ? A : B;
          m.shelfTitle.textContent = c.lista;
          m.shelf.classList.add("is-open");
          return [connRow(m, "Google Agenda", c.botao), connRow(m, "Gmail", c.botao), connRow(m, "Google Drive", c.botao)];
        });
        await anim(mocks.map(function (m) { return m.shelf; }), { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
        if (!ok()) return;
        await wait(500); if (!ok()) return;
        rows.forEach(function (r) { r[0].classList.add("is-hl"); });
        await anim(rows.map(function (r) { return r[0]; }), { scale: [1, 1.05, 1] }, { duration: 0.45 });
        if (!ok()) return;
        var perms = mocks.map(function (m) {
          var who = m.root.getAttribute("data-ai") === "a" ? "o Claude" : "o ChatGPT";
          return permission(m, "Permitir acesso à sua agenda?", "Você escolhe o que " + who + " pode ver e fazer. Dá pra desligar quando quiser.", "Permitir");
        });
        await anim(perms, { opacity: [0, 1], scale: [0.92, 1] }, { duration: 0.35 });
        if (!ok()) return;
        await wait(900); if (!ok()) return;
        await anim(perms.map(function (p) { return p.querySelector(".perm-btn"); }), { scale: [1, 0.92, 1] }, { duration: 0.3 });
        await anim(perms, { opacity: [1, 0] }, { duration: 0.25 });
        perms.forEach(function (p) { p.remove(); });
        rows.forEach(function (r) { connect(r[0]); });
        await anim(rows.map(function (r) { return r[0].querySelector(".conn-btn"); }), { scale: [0.7, 1] }, { type: "spring", bounce: 0.5, duration: 0.5 });
      },

      // 3. Agora ela consulta sua agenda
      async function (ok) {
        mocks.forEach(function (m) {
          var c = m.root.getAttribute("data-ai") === "a" ? CONN.a : CONN.b;
          m.shelfTitle.textContent = c.lista;
          m.shelf.classList.add("is-open");
          connect(connRow(m, "Google Agenda", c.botao));
        });
        var q = "O que eu tenho na agenda amanhã?";
        await both(function (m, k) { return wait(k * 250).then(function () { return typeInto(m.typed, q, 32); }); });
        if (!ok()) return;
        await wait(250); if (!ok()) return;
        mocks.forEach(function (m) { m.typed.textContent = ""; });
        await anim(mocks.map(function (m) { return bubble(m, "u", q); }), { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
        if (!ok()) return;
        await anim(mocks.map(function (m) { return chip(m, "Consultando Google Agenda"); }), { opacity: [0, 1], scale: [0.85, 1] }, { type: "spring", bounce: 0.4, duration: 0.5 });
        if (!ok()) return;
        var rs = mocks.map(function (m) { var r = bubble(m, "a", ""); r.style.opacity = "1"; return r; });
        await Promise.all(rs.map(function (r) { return typeInto(r.querySelector(".msg-text"), "Amanhã: 9h reunião com o fornecedor e 14h entrega da encomenda da Ana. Você está livre das 10h às 12h.", 48); }));
      },

      // 4. Plugin: o pacote pronto
      async function (ok) {
        var wrap = el("div", "pack");
        var head = el("div", "pack-head");
        head.append(el("span", "pack-k", "Plugin"), el("span", "pack-n", "Atendimento completo"));
        var items = rowsIn("pack-item", [
          [["pi-t", "skill"], ["pi-n", "atendimento-whatsapp"]],
          [["pi-t", "skill"], ["pi-n", "cobranca-gentil"]],
          [["pi-t", "conector"], ["pi-n", "Gmail"]],
          [["pi-t", "conector"], ["pi-n", "Google Agenda"]],
        ]);
        var btn = el("span", "pack-btn", "Instalar");
        var paths = el("p", "where-foot", CONN.pacote);
        btn.style.opacity = "0"; paths.style.opacity = "0";
        wrap.append(head); items.forEach(function (i) { wrap.append(i); }); wrap.append(btn);
        var outer = el("div", "pack-outer"); outer.append(wrap, paths);
        board.append(outer);
        await showBoard(); if (!ok()) return;
        await anim(wrap, { opacity: [0, 1], y: [16, 0] }, { duration: 0.4 });
        await anim(items, { opacity: [0, 1], x: [-10, 0] }, { duration: 0.3, delay: stagger(0.25) });
        if (!ok()) return;
        await anim(btn, { opacity: [0, 1] }, { duration: 0.3 });
        await wait(500); if (!ok()) return;
        await anim(btn, { scale: [1, 0.9, 1] }, { duration: 0.3 });
        btn.textContent = "Instalado: tudo de uma vez"; btn.classList.add("is-on");
        await anim(paths, { opacity: [0, 1], y: [8, 0] }, { duration: 0.4 });
      },

      // 5. Conecte com cuidado
      async function (ok) {
        var wrap = el("div", "rules");
        var cards = [
          ["Só o que precisa", "Cada conector é uma porta aberta pros seus dados."],
          ["Leia a permissão", "Ver é diferente de enviar, editar ou apagar."],
          ["Desligue o que não usa", "Conector parado não precisa ficar ligado."],
          ["Desconfie de ordem escondida", "Um email ou documento pode trazer instruções pra IA. Confira antes de deixar ela enviar ou apagar algo."],
        ].map(function (r) {
          var c = el("div", "rule");
          c.append(el("p", "rule-t", r[0]), el("p", "rule-s", r[1]));
          c.style.opacity = "0"; wrap.append(c); return c;
        });
        var foot = el("p", "where-foot", "Dado de cliente conectado também é responsabilidade sua (LGPD).");
        foot.style.opacity = "0";
        var outer = el("div", "rules-outer"); outer.append(wrap, foot);
        board.append(outer);
        await showBoard(); if (!ok()) return;
        await anim(cards, { opacity: [0, 1], y: [14, 0] }, { duration: 0.4, delay: stagger(0.35) });
        if (!ok()) return;
        await anim(cards[3], { scale: [1, 1.04, 1] }, { duration: 0.5 });
        await anim(foot, { opacity: [0, 1] }, { duration: 0.4 });
      },

      // 6. Onde funciona hoje
      async function (ok) {
        var wrap = el("div", "where");
        var h = el("p", "where-h", "Conectores e plugins · " + D.VERIFICADO_EM);
        var rows = CONN.onde.map(function (r) {
          var row = el("div", "where-row");
          row.append(el("span", "where-name", r[0]), el("span", "where-pill" + (r[3] ? " part" : ""), r[1]), el("span", "where-note", r[2]));
          row.style.opacity = "0";
          return row;
        });
        h.style.opacity = "0";
        wrap.append(h); rows.forEach(function (r) { wrap.append(r); });
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(h, { opacity: [0, 1] }, { duration: 0.3 });
        await anim(rows, { opacity: [0, 1], x: [-14, 0] }, { duration: 0.4, delay: stagger(0.25) });
      },
    ],

    5: [
      // 1. Uma skill é só uma pasta
      async function (ok) {
        var wrap = el("div", "anat");
        var rows = rowsIn("anat-row", [
          [["an-f", "atendimento-whatsapp/"], ["an-n", "o nome da pasta é o nome da skill"]],
          [["an-f", "├ SKILL.md"], ["an-n", "obrigatório: cabeçalho + instruções"]],
          [["an-f", "├ references/"], ["an-n", "textos de apoio: cardápio, tabela de preços"]],
          [["an-f", "├ scripts/"], ["an-n", "código que a IA roda"]],
          [["an-f", "└ assets/"], ["an-n", "modelos e imagens"]],
        ]);
        rows.forEach(function (r) { wrap.append(r); });
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(rows, { opacity: [0, 1], x: [-12, 0] }, { duration: 0.35, delay: stagger(0.35) });
        if (!ok()) return;
        rows[1].classList.add("is-hl");
        await anim(rows[1], { scale: [1, 1.03, 1] }, { duration: 0.45 });
      },

      // 2. O cabeçalho decide tudo
      async function (ok) {
        var wrap = el("div", "fm");
        var lines = rowsIn("fm-line", [
          [["fm-c", "---"]],
          [["fm-k", "name: "], ["fm-v", "atendimento-whatsapp"]],
          [["fm-k", "description: "], ["fm-v", "Responde clientes no tom da loja. Use quando pedirem pra responder um cliente."]],
          [["fm-c", "---"]],
          [["fm-c", "# Atendimento no WhatsApp"]],
          [["fm-c", "1. No máximo 4 linhas…"]],
        ]);
        lines.forEach(function (l) { wrap.append(l); });
        var notes = rowsIn("fm-note", [
          "name: minúsculas e hífen, até 64 caracteres, igual ao nome da pasta",
          "description: o quê + quando usar. No claude.ai, fique abaixo de 200 caracteres",
          "Depois do segundo ---: instruções em texto normal",
        ]);
        var outer = el("div", "fm-outer"); outer.append(wrap);
        var nb = el("div", "fm-notes"); notes.forEach(function (n) { nb.append(n); }); outer.append(nb);
        board.append(outer);
        await showBoard(); if (!ok()) return;
        await anim(lines, { opacity: [0, 1] }, { duration: 0.3, delay: stagger(0.15) });
        if (!ok()) return;
        for (var i = 0; i < 3; i++) {
          var target = [lines[1], lines[2], lines[4]][i];
          target.classList.add("is-hl");
          await anim(notes[i], { opacity: [0, 1], x: [10, 0] }, { duration: 0.35 });
          await wait(600); if (!ok()) return;
          target.classList.remove("is-hl");
        }
      },

      // 3. Ela lê em três camadas
      async function (ok) {
        var wrap = el("div", "layers");
        var cards = [
          ["1 · Sempre", "Nome e descrição de todas as skills ligadas (uns 100 tokens cada)."],
          ["2 · Quando a skill é ativada", "O corpo do SKILL.md (recomendado: menos de 5.000 tokens)."],
          ["3 · Só se precisar", "Os arquivos extras: referências, scripts, modelos."],
        ].map(function (c, i) {
          var d = el("div", "layer l" + (i + 1));
          d.append(el("p", "layer-t", c[0]), el("p", "layer-s", c[1]));
          d.style.opacity = "0"; wrap.append(d); return d;
        });
        var foot = el("p", "where-foot", "Por isso dá pra ter dezenas de skills sem deixar a IA lenta.");
        foot.style.opacity = "0";
        var outer = el("div", "layers-outer"); outer.append(wrap, foot);
        board.append(outer);
        await showBoard(); if (!ok()) return;
        for (var i = 0; i < cards.length; i++) {
          await anim(cards[i], { opacity: [0, 1], y: [16, 0] }, { duration: 0.4 });
          await wait(700); if (!ok()) return;
        }
        await anim(foot, { opacity: [0, 1] }, { duration: 0.4 });
      },

      // 4. Script: conta certa, sem chute
      async function (ok) {
        var wrap = el("div", "script");
        var ask = el("p", "bd-req", "Pedido: “quanto fica o frete pra 7 km?”");
        var code = el("div", "code");
        code.append(el("p", "code-h", "scripts/frete.py"));
        var lines = rowsIn("code-l", ["km = 7", "taxa = 5 + km * 1.5", "print(f\"R$ {taxa:.2f}\")"]);
        lines.forEach(function (l) { code.append(l); });
        var out = el("p", "code-out", "→ R$ 15.50");
        out.style.opacity = "0"; code.append(out);
        ask.style.opacity = "0"; code.style.opacity = "0";
        wrap.append(ask, code);
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(ask, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.35 });
        await anim(code, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35 });
        await anim(lines, { opacity: [0, 1] }, { duration: 0.25, delay: stagger(0.3) });
        if (!ok()) return;
        await wait(400); if (!ok()) return;
        await anim(out, { opacity: [0, 1], scale: [0.8, 1] }, { type: "spring", bounce: 0.5, duration: 0.5 });
        if (!ok()) return;
        await stamp("Rodou, não chutou");
      },

      // 5. MCP: a tomada dos conectores
      async function (ok) {
        var wrap = el("div", "mcp");
        var left = el("div", "mcp-ai"); left.append(el("span", null, "Claude"), el("span", null, "ChatGPT"));
        var mid = el("div", "mcp-mid"); mid.append(el("span", "mcp-line"), el("span", "mcp-tag", "MCP"));
        var right = el("div", "mcp-apps");
        var apps = ["Google Agenda", "Gmail", "Supabase", "Seu sistema"].map(function (n) { var a = el("span", "mcp-app", n); a.style.opacity = "0"; right.append(a); return a; });
        left.style.opacity = "0"; mid.style.opacity = "0";
        wrap.append(left, mid, right);
        var foot = el("p", "where-foot", "Conector = servidor MCP. Plugin = skills + conectores num pacote só.");
        foot.style.opacity = "0";
        var outer = el("div", "mcp-outer"); outer.append(wrap, foot);
        board.append(outer);
        await showBoard(); if (!ok()) return;
        await anim(left, { opacity: [0, 1], x: [-12, 0] }, { duration: 0.35 });
        await anim(mid, { opacity: [0, 1] }, { duration: 0.3 });
        await anim(mid.querySelector(".mcp-line"), { scaleX: [0, 1] }, { duration: 0.6 });
        await anim(apps, { opacity: [0, 1], x: [12, 0] }, { duration: 0.3, delay: stagger(0.2) });
        if (!ok()) return;
        await anim(foot, { opacity: [0, 1] }, { duration: 0.4 });
      },

      // 6. No Claude Code e no Codex
      async function (ok) {
        var wrap = el("div", "where");
        var h = el("p", "where-h", "Pra quem programa · " + D.VERIFICADO_EM);
        var rows = TECH.map(function (r) {
          var row = el("div", "where-row");
          row.append(el("span", "where-name", r[0]), el("span", "where-pill", r[1]), el("code", "where-note", r[2]));
          row.style.opacity = "0";
          return row;
        });
        var foot = el("p", "where-foot", "O mesmo SKILL.md serve no chat e no terminal.");
        h.style.opacity = "0"; foot.style.opacity = "0";
        wrap.append(h); rows.forEach(function (r) { wrap.append(r); }); wrap.append(foot);
        board.append(wrap);
        await showBoard(); if (!ok()) return;
        await anim(h, { opacity: [0, 1] }, { duration: 0.3 });
        await anim(rows, { opacity: [0, 1], x: [-14, 0] }, { duration: 0.4, delay: stagger(0.25) });
        if (!ok()) return;
        await anim(foot, { opacity: [0, 1] }, { duration: 0.4 });
      },
    ],
  };

  // ---------- Skills prontas ----------
  var curSkill = D.SKILLS[0].id;
  function selectSkill(id) {
    curSkill = id;
    var s = D.SKILLS.find(function (x) { return x.id === id; });
    $("sk-pre").textContent = s.texto;
    $("sk-eyebrow").textContent = "Skill · " + s.area;
    $("sk-title").textContent = s.titulo;
    $("sk-desc").textContent = s.desc;
    $("sk-name").textContent = s.id;
    var rows = $("sk-rows");
    rows.textContent = "";
    function row(label, node) {
      var r = el("div", "row"); var dd = el("dd"); dd.append(node);
      r.append(el("dt", null, label), dd); rows.append(r);
    }
    row("Bom pra", document.createTextNode(s.bomPra));
    var f = document.createDocumentFragment();
    f.append(document.createTextNode("“" + s.comoPedir + "”"));
    var cb = el("button", "copy-btn", "Copiar"); cb.type = "button";
    cb.setAttribute("aria-label", "Copiar o pedido de exemplo");
    cb.addEventListener("click", function () { copyWithFeedback(cb, s.comoPedir); });
    f.append(cb);
    row("Como pedir", f);
    row("Funciona em", document.createTextNode("Claude (todos os planos) · ChatGPT Business, Enterprise e Edu · Gemini · Copilot"));
    renderSkillThumbs();
  }
  function renderSkillThumbs() {
    var w = $("sk-thumbs");
    w.textContent = "";
    D.SKILLS.forEach(function (s) {
      var b = el("button", "sk-thumb");
      b.type = "button";
      b.setAttribute("aria-pressed", String(s.id === curSkill));
      b.append(el("span", "a", s.area), el("span", "t", s.titulo));
      b.addEventListener("click", function () {
        selectSkill(s.id);
        $("sk-detail").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
      w.append(b);
    });
  }
  $("sk-copy").addEventListener("click", function () {
    var s = D.SKILLS.find(function (x) { return x.id === curSkill; });
    copyWithFeedback($("sk-copy"), s.texto);
  });
  $("skills-count").textContent = String(D.SKILLS.length);

  // ---------- Kit, link e newsletter ----------
  $("kit-copy").addEventListener("click", function () { copyWithFeedback($("kit-copy"), $("kit-msg").textContent); });
  var pageUrl = location.origin + location.pathname;
  $("page-url").textContent = pageUrl;
  $("copy-url").addEventListener("click", function () { copyWithFeedback($("copy-url"), pageUrl); });
  $("end-form").append(MB.subscribeForm({
    id: "f-curso",
    interest: "curso-skills",
    button: "Assinar grátis",
    done: "Pronto, você está na lista. Novas skills e aulas chegam no seu email.",
  }));
  $("year").textContent = new Date().getFullYear();

  // ---------- Início ----------
  selectSkill(curSkill);
  renderProgress();
  renderAulaCards();
  renderLesson();
  var h = (location.hash || "").slice(1);
  if (h === "skills" || h === "kit") selectTab(h); else selectTab("aulas");
  }
})();
