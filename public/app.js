(function () {
  "use strict";
  var C = window.CONFIG;
  var $ = function (id) { return document.getElementById(id); };

  var state = { cat: null, id: null };
  var byCat = function (cat) { return C.PRODUCTS.filter(function (p) { return p.category === cat; }); };
  var typeLabel = function (p) { return p.category === "cursos" ? "Mini-curso" : "Skill de IA"; };
  var isLive = function (p) { return !!(p.checkoutUrl && p.price); };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Capa: imagem se houver; senão capa da marca (skill = vermelha, mini-curso = branca).
  function cover(p) {
    var c = el("div", "cover " + (p.category === "cursos" ? "cover-cursos" : "cover-skills"));
    if (p.cover) {
      var img = el("img");
      img.src = p.cover; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      c.append(img);
    } else {
      c.append(el("span", "cover-title", p.title));
    }
    return c;
  }

  // ---------- Categorias (abas) ----------
  function renderChips() {
    var wrap = $("chips");
    wrap.textContent = "";
    C.CATEGORIES.forEach(function (cat) {
      var n = byCat(cat.id).length;
      if (!n) return;
      var b = el("button", "chip");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.id = "tab-" + cat.id;
      b.setAttribute("aria-controls", "thumbs");
      b.setAttribute("aria-selected", String(cat.id === state.cat));
      b.tabIndex = cat.id === state.cat ? 0 : -1;
      b.append(document.createTextNode(cat.label + " "), el("span", "count", String(n)));
      b.addEventListener("click", function () { selectCat(cat.id); });
      wrap.append(b);
    });
  }

  // Setas esquerda/direita entre as abas (padrão WAI-ARIA).
  $("chips").addEventListener("keydown", function (e) {
    var tabs = Array.prototype.slice.call(this.querySelectorAll('[role="tab"]'));
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var next = null;
    if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
    if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === "Home") next = tabs[0];
    if (e.key === "End") next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    next.click();
    $(next.id).focus();
  });

  function selectCat(cat) {
    state.cat = cat;
    var list = byCat(cat);
    if (!list.some(function (p) { return p.id === state.id; })) state.id = list[0] && list[0].id;
    renderChips();
    $("thumbs").setAttribute("aria-labelledby", "tab-" + cat);
    renderThumbs();
    renderDetail();
  }

  // ---------- Miniaturas ----------
  function renderThumbs() {
    var wrap = $("thumbs");
    wrap.textContent = "";
    byCat(state.cat).forEach(function (p) {
      var b = el("button", "thumb");
      b.type = "button";
      b.setAttribute("aria-pressed", String(p.id === state.id));
      b.setAttribute("aria-controls", "detail");
      b.setAttribute("aria-label", p.title);
      b.append(cover(p));
      b.addEventListener("click", function () {
        state.id = p.id;
        renderThumbs();
        renderDetail();
        wrap.querySelector('[aria-pressed="true"]').focus();
      });
      wrap.append(b);
    });
  }

  // ---------- Detalhe ----------
  function row(label, valueNode) {
    var r = el("div", "row");
    var dd = el("dd");
    dd.append(valueNode);
    r.append(el("dt", null, label), dd);
    return r;
  }

  function copyBtn(text) {
    var b = el("button", "copy-btn", "Copiar");
    b.type = "button";
    b.setAttribute("aria-label", "Copiar o pedido de exemplo");
    b.addEventListener("click", function () {
      var ok = function () { b.textContent = "Copiado ✓"; setTimeout(function () { b.textContent = "Copiar"; }, 1800); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(ok, function () { fallbackCopy(text); ok(); });
      } else { fallbackCopy(text); ok(); }
    });
    return b;
  }
  function fallbackCopy(text) {
    var t = el("textarea"); t.value = text; t.setAttribute("readonly", "");
    t.style.position = "absolute"; t.style.left = "-9999px";
    document.body.append(t); t.select();
    try { document.execCommand("copy"); } catch (e) { /* sem suporte */ }
    t.remove();
  }

  function renderDetail() {
    var p = C.PRODUCTS.find(function (x) { return x.id === state.id; });
    if (!p) return;
    var live = isLive(p);

    var pv = $("d-preview");
    pv.textContent = "";
    pv.classList.toggle("has-media", !!p.cover);
    pv.append(el("span", "preview-label", live ? "Disponível" : "Prévia"), cover(p));

    $("d-type").textContent = typeLabel(p);
    var st = $("d-status");
    st.textContent = live ? "Disponível" : "Em breve";
    st.classList.toggle("is-live", live);
    $("d-title").textContent = p.title;
    $("d-desc").textContent = p.desc;

    var rows = $("d-rows");
    rows.textContent = "";
    if (p.fit) rows.append(row("Bom pra", document.createTextNode(p.fit)));
    if (p.prompt) {
      var f = document.createDocumentFragment();
      f.append(document.createTextNode("“" + p.prompt + "”"), copyBtn(p.prompt));
      rows.append(row("Como pedir", f));
    }
    if (p.format) rows.append(row("Formato", document.createTextNode(p.format)));

    renderAction(p, live);
  }

  // ---------- Ação: comprar ou entrar na lista ----------
  function renderAction(p, live) {
    var box = $("d-action");
    box.textContent = "";

    if (live) {
      var price = el("p", "price", p.price);
      var sub = el("p", "action-sub", "Pagamento único · acesso enviado por email após a compra");
      var buy = el("a", "btn btn-primary", "Comprar agora");
      buy.href = p.checkoutUrl;
      buy.rel = "noopener";
      box.append(price, sub, buy);
      return;
    }

    box.append(
      el("p", "action-title", "Quer esse? Assine e seja avisado."),
      el("p", "action-sub", "Quem assina a newsletter fica sabendo primeiro, antes de abrir pra todo mundo.")
    );
    box.append(subscribeForm({
      id: "f-" + p.id,
      interest: p.id,
      button: "Me avise",
      done: "Pronto. Você vai saber primeiro quando “" + p.title + "” sair."
    }));
  }

  // Formulário de inscrição: mora em shared.js (o curso usa o mesmo).
  var subscribeForm = window.MB.subscribeForm;

  // ---------- Início ----------
  document.querySelectorAll(".insta-link").forEach(function (a) { a.href = C.INSTAGRAM_URL; });
  $("year").textContent = new Date().getFullYear();
  $("hero-form").append(subscribeForm({
    id: "f-hero",
    button: "Assinar grátis",
    done: "Pronto, você está na lista. A próxima edição chega no seu email."
  }));
  var first = C.SHOW_SHOWCASE && C.CATEGORIES.find(function (c) { return byCat(c.id).length; });
  if (first) {
    selectCat(first.id);
  } else {
    // Sem vitrine: some a seção e tudo que aponta pra ela.
    $("vitrine").hidden = true;
    document.querySelectorAll("[data-needs-showcase]").forEach(function (n) { n.remove(); });
  }
})();
