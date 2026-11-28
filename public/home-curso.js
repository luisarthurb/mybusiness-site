// Seção "Minicurso" da home. Aulas e skills vêm de /cursos/aulas.js (window.CURSO, mesma fonte do curso);
// quais aulas são pagas vem de config.js (PAID_LESSONS). Sem CURSO, a seção mostra só o topo e o botão.
(function () {
  "use strict";
  var C = window.CONFIG || {};
  var D = window.CURSO;
  var MB = window.MB || {};
  if (!D || !D.AULAS) return;

  var paid = C.PAID_LESSONS || [];
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function lockIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", "16"); svg.setAttribute("height", "16");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "lock");
    var p = document.createElementNS(ns, "path");
    p.setAttribute("d", "M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1Zm2 0h6V7a3 3 0 0 0-6 0v3Z");
    p.setAttribute("fill", "currentColor");
    svg.append(p);
    return svg;
  }

  // ---------- Aulas ----------
  var list = $("lessons");
  var paidTitles = [];
  D.AULAS.forEach(function (a) {
    var isPaid = paid.indexOf(a.n) > -1;
    var li = el("li", "lesson" + (isPaid ? " is-paid" : a.pronta ? " is-open" : " is-soon"));
    var inner = isPaid || !a.pronta ? el("div", "lesson-inner") : el("a", "lesson-inner");
    if (!isPaid && a.pronta) inner.href = "/cursos/skills";

    var num = el("span", "lesson-n", String(a.n));
    var body = el("span", "lesson-body");
    body.append(el("span", "lesson-title", a.titulo));
    var meta = el("span", "lesson-meta");
    if (isPaid) {
      paidTitles.push("Aula " + a.n + " (" + a.titulo.replace(/\s*\(opcional\)\s*/i, "") + ")");
      var tag = el("span", "pill pill-paid");
      tag.append(lockIcon(), document.createTextNode("Pago · em breve"));
      meta.append(tag);
      inner.setAttribute("aria-label", "Aula " + a.n + ": " + a.titulo + ". Aula paga, em breve.");
    } else if (a.pronta) {
      meta.append(el("span", "pill pill-free", "Grátis"), document.createTextNode(a.min ? " · " + a.min + " min" : ""));
    } else {
      meta.append(el("span", "pill", "Em breve"));
    }
    body.append(meta);
    inner.append(num, body);
    if (!isPaid && a.pronta) inner.append(el("span", "lesson-go", "Assistir →"));
    li.append(inner);
    list.append(li);
  });

  // ---------- Aviso das aulas pagas ("Me avise", sem preço nem checkout) ----------
  if (paidTitles.length && MB.subscribeForm) {
    $("paid-text").textContent = paidTitles.join(" e ") + " fazem parte da versão paga, que ainda não abriu. Deixe o email e saiba primeiro quando abrir.";
    $("paid-form").append(MB.subscribeForm({
      id: "f-aulas-pagas",
      interest: "aulas-pagas",
      button: "Me avise",
      done: "Pronto. Você vai saber primeiro quando as aulas pagas abrirem."
    }));
    $("paid-box").hidden = false;
  }

  // ---------- Skills prontas ----------
  var cards = $("skill-cards");
  (D.SKILLS || []).forEach(function (s) {
    var card = el("article", "skill-card");
    if (s.area) card.append(el("span", "skill-area", s.area));
    card.append(el("h4", "skill-title", s.titulo));
    if (s.desc) card.append(el("p", "skill-desc", s.desc));
    var acts = el("div", "skill-actions");
    if (s.zip) {
      var dl = el("a", "skill-dl", "Baixar .zip grátis");
      dl.href = s.zip; dl.setAttribute("download", "");
      acts.append(dl);
    }
    var go = el("a", "skill-go", s.zip ? "Como instalar →" : "Copiar no minicurso →");
    go.href = "/cursos/skills#skills";
    acts.append(go);
    card.append(acts);
    cards.append(card);
  });
})();
